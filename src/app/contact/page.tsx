import { Metadata } from 'next';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | The English Language',
  description: 'Get in touch with us for inquiries, registration, or any questions about our English tutoring programmes.',
};

export default function ContactPage() {
  return (
    <main className="container-main section-padding">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="heading-1 mb-4">Get in Touch</h1>
        <p className="text-xl text-slate-600">
          Have questions about our programmes or need help finding the right class? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <ContactForm />

        <div className="space-y-6">
          <div className="card p-6 flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600 mt-1">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Email Us</h3>
              <p className="text-slate-600 mb-2">For course inquiries and registration support.</p>
              <a href="mailto:farikaatkins@gmail.com" className="text-blue-600 hover:underline font-medium">farikaatkins@gmail.com</a>
            </div>
          </div>

          <div className="card p-6 flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-lg text-green-600 mt-1">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Call Us</h3>
              <p className="text-slate-600 mb-2">Mon–Sat from 9am to 6pm EST.</p>
              <a href="tel:+18762952776" className="text-blue-600 hover:underline font-medium">+1 (876) 295-2776</a>
            </div>
          </div>

          <div className="card p-6 flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-lg text-purple-600 mt-1">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Location</h3>
              <p className="text-slate-600">Classes are conducted online (Zoom / Google Meet) for students across Kingston, Montego Bay, and all parishes in Jamaica.</p>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg mt-8">
            <h3 className="text-xl font-serif font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-green-400" />
              Prefer WhatsApp?
            </h3>
            <p className="text-slate-300 mb-6">Send us a message on WhatsApp for fast answers regarding course placement, schedule availability, or sibling discounts.</p>
            <a href="https://wa.me/18762952776" target="_blank" rel="noopener noreferrer" className="btn-success w-full text-center inline-block py-3 rounded-lg font-medium">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
