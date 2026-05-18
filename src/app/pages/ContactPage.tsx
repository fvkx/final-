import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { inquiriesApi } from '../lib/adminApi';

interface FormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

const officeInfo = [
  {
    icon: MapPin,
    label: 'Office Address',
    value: 'Municipal Tourism Office, Municipal Hall, Poblacion, Balingasag, Misamis Oriental 9005, Philippines',
  },
  {
    icon: Phone,
    label: 'Contact Number',
    value: '(088) 856-1234',
  },
  {
    icon: Mail,
    label: 'Email Address',
    value: 'tourism@balingasag.gov.ph',
  },
  {
    icon: Clock,
    label: 'Office Hours',
    value: 'Monday – Friday: 8:00 AM – 5:00 PM\nClosed on weekends and public holidays',
  },
];

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormData>();

  useEffect(() => {
    document.title = 'Contact Us | Balingasag Municipal Tourism Office';
  }, []);

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      await inquiriesApi.create(data);
      setSubmitted(true);
      reset();
    } catch (error: any) {
      console.error('Failed to submit inquiry:', error);
      setSubmitError('Failed to send message. Please verify your internet connection, ensure your email address is correct, and try again.');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-teal-800 py-20 px-4 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-teal-400 to-emerald-900" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-teal-300 font-semibold text-sm uppercase tracking-widest">Get in Touch</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4">Contact the Tourism Office</h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Have questions about visiting Balingasag? The Municipal Tourism Office is happy to assist with your inquiries.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Office Info */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Office Information</span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-1 mb-1">Municipal Tourism Office</h2>
              <p className="text-gray-500 text-sm">Balingasag, Misamis Oriental</p>
            </div>

            <div className="space-y-4">
              {officeInfo.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 bg-teal-50 border border-teal-100 rounded-xl p-4">
                  <div className="w-9 h-9 bg-teal-200 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-teal-800" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-0.5">{label}</div>
                    <p className="text-gray-700 text-sm whitespace-pre-line">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-amber-800 text-sm">
                <strong>Note:</strong> This website is a tourism information portal only. For booking-related services, event permits, or official documentation, please contact the Municipal Hall directly.
              </p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                    Thank you for reaching out. The Balingasag Municipal Tourism Office will respond to your inquiry during office hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Inquiry Form</span>
                    <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Send Us a Message</h2>
                    <p className="text-gray-500 text-sm mt-1">All fields are required. We aim to respond within 1–2 business days.</p>
                  </div>

                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3 mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm">Submission Failed</div>
                        <p className="text-xs text-red-700 mt-0.5 leading-relaxed">{submitError}</p>
                        <button 
                          type="button"
                          onClick={() => setSubmitError(null)}
                          className="text-xs text-red-600 hover:text-red-800 underline font-medium mt-1.5 block"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Juan dela Cruz"
                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-gray-800 placeholder-gray-400 ${
                          errors.fullName
                            ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                            : 'border-gray-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                        }`}
                        {...register('fullName', {
                          required: 'Full name is required.',
                          minLength: { value: 2, message: 'Name must be at least 2 characters.' }
                        })}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. juan@example.com"
                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-gray-800 placeholder-gray-400 ${
                          errors.email
                            ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                            : 'border-gray-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                        }`}
                        {...register('email', {
                          required: 'Email address is required.',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Please enter a valid email address.'
                          }
                        })}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Tourist Spot Inquiry, Event Information"
                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-gray-800 placeholder-gray-400 ${
                          errors.subject
                            ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                            : 'border-gray-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                        }`}
                        {...register('subject', {
                          required: 'Subject is required.',
                          minLength: { value: 5, message: 'Subject must be at least 5 characters.' }
                        })}
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.subject.message}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Tell us how we can help you..."
                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-gray-800 placeholder-gray-400 resize-none ${
                          errors.message
                            ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                            : 'border-gray-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                        }`}
                        {...register('message', {
                          required: 'Message is required.',
                          minLength: { value: 20, message: 'Message must be at least 20 characters.' }
                        })}
                      />
                      {errors.message && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.message.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white px-7 py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Inquiry
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
