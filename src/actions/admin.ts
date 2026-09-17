'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { sendBookingConfirmedEmail, sendBookingRejectedEmail } from '@/lib/email';
import { classSchema, type ClassFormData, type BlogPostFormData, type TestimonialFormData } from '@/lib/validations';

const checkAuth = async () => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
};

export async function approveBooking(id: string) {
  await checkAuth();
  
  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: 'CONFIRMED',
      confirmedAt: new Date(),
    },
    include: { class: { include: { programme: true } } }
  });

  // Send confirmation email to parent
  try {
    await sendBookingConfirmedEmail({
      studentName: booking.studentName,
      parentName: booking.parentName,
      parentEmail: booking.parentEmail,
      classTitle: booking.class.title,
      programmeName: booking.class.programme.name,
      dayOfWeek: booking.class.dayOfWeek,
      startTime: booking.class.startTime,
      endTime: booking.class.endTime,
      priceJMD: booking.class.priceJMD,
      referenceNumber: booking.referenceNumber,
      meetingLink: booking.class.meetingLink || undefined,
    });
  } catch (err) {
    console.error('Failed to send confirmation email:', err);
  }

  revalidatePath('/admin/bookings');
  revalidatePath('/admin/classes');
  revalidatePath('/admin');
  revalidatePath('/classes');
}

export async function rejectBooking(id: string) {
  await checkAuth();
  
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { class: { include: { programme: true } } },
  });

  if (!booking) throw new Error('Booking not found');

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        rejectedAt: new Date(),
      },
    });

    await tx.class.update({
      where: { id: booking.classId },
      data: { enrolledCount: { decrement: 1 } },
    });
  });

  try {
    await sendBookingRejectedEmail({
      studentName: booking.studentName,
      parentName: booking.parentName,
      parentEmail: booking.parentEmail,
      classTitle: booking.class.title,
      programmeName: booking.class.programme.name,
      dayOfWeek: booking.class.dayOfWeek,
      startTime: booking.class.startTime,
      endTime: booking.class.endTime,
      priceJMD: booking.class.priceJMD,
      referenceNumber: booking.referenceNumber,
    });
  } catch (err) {
    console.error('Failed to send rejection email:', err);
  }

  revalidatePath('/admin/bookings');
  revalidatePath('/admin');
  revalidatePath('/classes');
}

export async function toggleClassActive(id: string) {
  await checkAuth();
  
  const cls = await prisma.class.findUnique({ where: { id }});
  if (cls) {
    await prisma.class.update({
      where: { id },
      data: { isActive: !cls.isActive }
    });
    revalidatePath('/admin/classes');
    revalidatePath('/classes');
  }
}

export async function createClass(data: ClassFormData) {
  await checkAuth();
  const parsed = classSchema.parse(data);
  await prisma.class.create({
    data: {
      programmeId: parsed.programmeId,
      title: parsed.title,
      description: parsed.description,
      dayOfWeek: parsed.dayOfWeek,
      startTime: parsed.startTime,
      endTime: parsed.endTime,
      capacity: parsed.capacity,
      priceJMD: parsed.priceJMD,
      term: parsed.term || 'Michaelmas 2026',
      meetingLink: parsed.meetingLink || '',
    }
  });
  revalidatePath('/admin/classes');
  revalidatePath('/classes');
}

export async function updateClass(id: string, data: ClassFormData) {
  await checkAuth();
  const parsed = classSchema.parse(data);
  await prisma.class.update({
    where: { id },
    data: {
      programmeId: parsed.programmeId,
      title: parsed.title,
      description: parsed.description,
      dayOfWeek: parsed.dayOfWeek,
      startTime: parsed.startTime,
      endTime: parsed.endTime,
      capacity: parsed.capacity,
      priceJMD: parsed.priceJMD,
      term: parsed.term || 'Michaelmas 2026',
      meetingLink: parsed.meetingLink || '',
    }
  });
  revalidatePath('/admin/classes');
  revalidatePath('/classes');
}

export async function createOrUpdateBlogPost(id: string | null, data: BlogPostFormData) {
  await checkAuth();
  if (id) {
    await prisma.blogPost.update({ where: { id }, data });
  } else {
    await prisma.blogPost.create({ data });
  }
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}

export async function toggleBlogPublished(id: string) {
  await checkAuth();
  const post = await prisma.blogPost.findUnique({ where: { id }});
  if (post) {
    await prisma.blogPost.update({
      where: { id },
      data: { 
        isPublished: !post.isPublished,
        publishedAt: !post.isPublished ? new Date() : null
      }
    });
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
  }
}

export async function createOrUpdateTestimonial(id: string | null, data: TestimonialFormData) {
  await checkAuth();
  if (id) {
    await prisma.testimonial.update({ where: { id }, data });
  } else {
    await prisma.testimonial.create({ data });
  }
  revalidatePath('/admin/testimonials');
}

export async function toggleTestimonialPublished(id: string) {
  await checkAuth();
  const t = await prisma.testimonial.findUnique({ where: { id }});
  if (t) {
    await prisma.testimonial.update({
      where: { id },
      data: { isPublished: !t.isPublished }
    });
    revalidatePath('/admin/testimonials');
  }
}

export async function markMessageRead(id: string) {
  await checkAuth();
  await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true }
  });
  revalidatePath('/admin/messages');
}

export async function deleteMessage(id: string) {
  await checkAuth();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath('/admin/messages');
}

export async function changePassword(currentPassword: string, newPassword: string) {
  await checkAuth();

  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) throw new Error('Unauthorized');

  if (!newPassword || newPassword.length < 10) {
    return { success: false, error: 'New password must be at least 10 characters.' };
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) return { success: false, error: 'Account not found.' };

  const isValid = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!isValid) return { success: false, error: 'Current password is incorrect.' };

  await prisma.adminUser.update({
    where: { email },
    data: { passwordHash: await bcrypt.hash(newPassword, 10) },
  });

  return { success: true };
}
