
import { Mail, Phone, MapPin, Clock, Globe, Users, BookOpen, CheckCircle, UserCheck } from 'lucide-react';
import { useState } from 'react';
import Footer from './Footer';

export default function AboutUs() {
    const [userType, setUserType] = useState('student');
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-500">

      {/* Hero Section */}
      <section className="relative bg-blue-600 dark:bg-blue-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Welcome to EduSprint</h2>
            <p className="text-blue-100 max-w-2xl mx-auto text-lg mb-6">
              The next-generation e-learning platform dedicated to transforming education through
              personalized learning experiences and expert instruction.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-white rounded-full"></div>
          <div className="absolute left-32 bottom-4 w-48 h-48 bg-white rounded-full"></div>
          <div className="absolute right-1/4 top-1/3 w-24 h-24 bg-white rounded-full"></div>
        </div>
      </section>
      <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Choose Your Journey
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              EduSprint caters to both learners and educators. Select your path below to learn more
              about how we can help you succeed.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-8">
            <button
              onClick={() => setUserType('student')}
              className={`flex-1 p-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                userType === 'student'
                  ? 'bg-blue-600 text-white shadow-xl'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:shadow-lg'
              }`}
              aria-label="Select Student Path"
            >
              <div className="flex justify-center mb-4">
                <div
                  className={`p-4 rounded-full ${
                    userType === 'student'
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  <BookOpen size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">I'm a Student</h3>
              <p
                className={`text-center ${
                  userType === 'student' ? 'text-blue-100' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Ready to learn and master new skills
              </p>
            </button>

            <button
              onClick={() => setUserType('instructor')}
              className={`flex-1 p-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                userType === 'instructor'
                  ? 'bg-blue-600 text-white shadow-xl'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:shadow-lg'
              }`}
              aria-label="Select Instructor Path"
            >
              <div className="flex justify-center mb-4">
                <div
                  className={`p-4 rounded-full ${
                    userType === 'instructor'
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  <UserCheck size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">I'm an Instructor</h3>
              <p
                className={`text-center ${
                  userType === 'instructor' ? 'text-blue-100' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Ready to share knowledge and expertise
              </p>
            </button>
          </div>

          <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
            {userType === 'student' && (
              <div className="space-y-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  For Students
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      <CheckCircle size={20} className="text-green-500 mr-2" />
                      Easy Registration Process
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Sign up in minutes with just your basic information. Get instant access to free
                      courses and explore our premium catalog.
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      <CheckCircle size={20} className="text-green-500 mr-2" />
                      Personalized Learning
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      AI-driven course recommendations tailored to your interests and goals. Track
                      progress and earn certificates.
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      <CheckCircle size={20} className="text-green-500 mr-2" />
                      Interactive Learning Experience
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Engage with videos, quizzes, projects, and discussions. Collaborate with
                      instructors and peers.
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      <CheckCircle size={20} className="text-green-500 mr-2" />
                      Affordable Pricing
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Access free courses or choose flexible payment plans. Monthly subscriptions or
                      per-course options with student discounts.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Student Resources
                  </h4>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <div className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</div>
                      <span>24/7 technical support for platform issues</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</div>
                      <span>Study groups and forums for peer learning</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</div>
                      <span>Career guidance and certificates</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</div>
                      <span>Mobile app for learning on the go</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {userType === 'instructor' && (
              <div className="space-y-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  For Instructors
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      <CheckCircle size={20} className="text-green-500 mr-2" />
                      Approval Process
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Submit credentials and experience for review. Approval takes 2-3 business days
                      to ensure high-quality standards.
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      <CheckCircle size={20} className="text-green-500 mr-2" />
                      Course Creation Tools
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Use our course builder with video hosting, quizzes, and analytics. Templates
                      help you create engaging content.
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      <CheckCircle size={20} className="text-green-500 mr-2" />
                      Revenue Sharing
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Earn commissions on course sales with transparent payouts. Monthly payments
                      with marketing support.
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      <CheckCircle size={20} className="text-green-500 mr-2" />
                      Instructor Community
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Network with educators, share best practices, and access webinars and workshops
                      for professional growth.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Instructor Resources
                  </h4>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <div className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</div>
                      <span>Dedicated support for course creation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</div>
                      <span>Marketing tools to promote courses</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</div>
                      <span>Student feedback to improve content</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</div>
                      <span>Exclusive events for top instructors</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/50 p-6 rounded-lg border border-red-200 dark:border-red-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Content Policies
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    We enforce strict policies to ensure a safe learning environment. Prohibited
                    content includes:
                  </p>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <div className="text-red-600 dark:text-red-400 mr-2 mt-1">•</div>
                      <span>Hate, discrimination, or violence based on race, gender, or religion</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-red-600 dark:text-red-400 mr-2 mt-1">•</div>
                      <span>Explicit or adult content</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-red-600 dark:text-red-400 mr-2 mt-1">•</div>
                      <span>Misleading or false information</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-red-600 dark:text-red-400 mr-2 mt-1">•</div>
                      <span>Plagiarized or copyrighted material</span>
                    </li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mt-4">
                    Violations may lead to course removal or account suspension. See our{' '}
                    <a
                      href="#"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Content Guidelines
                    </a>
                    .
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-[1.02] hover:shadow-xl">
            <div className="bg-blue-600 dark:bg-blue-700 p-6">
              <h3 className="text-xl font-bold text-white">Contact Information</h3>
              <p className="text-blue-100 mt-2">Reach out to us through any of these channels</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Phone</h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">+1 (555) 123-4567</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={14} className="mr-1" />
                    <span>Mon-Fri, 9AM-5PM EST</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Email</h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">support@edusprint.com</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">info@edusprint.com</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={14} className="mr-1" />
                    <span>24/7 Support Available</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Location</h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">123 Learning Avenue</p>
                  <p className="text-gray-600 dark:text-gray-300">Education District, ED 54321</p>
                  <p className="text-gray-600 dark:text-gray-300">United States</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Website</h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">www.edusprint.com</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 transition-all hover:bg-blue-100 dark:hover:bg-blue-900 hover:scale-110" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                </a>
                <a href="#" className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 transition-all hover:bg-blue-100 dark:hover:bg-blue-900 hover:scale-110" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"></path>
                  </svg>
                </a>
                <a href="#" className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 transition-all hover:bg-blue-100 dark:hover:bg-blue-900 hover:scale-110" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772c-.5.509-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.041 0 2.67.01 2.986.058 4.04.045.976.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058 2.67 0 2.987-.01 4.04-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041 0-2.67-.01-2.986-.058-4.04-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.048-1.37-.058-4.041-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.466a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.674a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"></path>
                  </svg>
                </a>
                <a href="#" className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 transition-all hover:bg-blue-100 dark:hover:bg-blue-900 hover:scale-110" aria-label="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
                  </svg>
                </a>
                <a href="#" className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 transition-all hover:bg-blue-100 dark:hover:bg-blue-900 hover:scale-110" aria-label="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 0 0-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.515 2.515 0 0 0 1.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831zM9.996 15.005l.005-6 5.207 3.005-5.212 2.995z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* About Us Section & About EduSprint */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Us */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 relative">
                  <div className="absolute inset-0 bg-blue-600 dark:bg-blue-700 opacity-80"></div>
                  <img 
                    src="/api/placeholder/400/320" 
                    alt="Students learning online" 
                    className="w-full h-full object-cover filter brightness-50" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users size={64} className="text-white" />
                  </div>
                </div>
                <div className="p-6 md:w-2/3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About EduSprint</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    EduSprint is a next-generation e-learning platform dedicated to providing high-quality educational content
                    that's accessible to everyone. With personalized learning paths and expert instructors, we're transforming
                    how people acquire new skills and knowledge.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our mission is to empower learners worldwide by breaking down barriers to education and creating
                    engaging, interactive learning experiences that drive real results.
                  </p>
                </div>
              </div>
            </div>
    
          </div>
        </div>
      </section>
      
      {/* Main Content */}
            

      {/* FAQ Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">Find quick answers to common questions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "How do I enroll in a course?",
                answer: "Simply browse our course catalog, select the course you're interested in, and click the 'Enroll Now' button. You'll be guided through the registration and payment process."
              },
              {
                question: "Are there any prerequisites for courses?",
                answer: "Prerequisites vary by course. Each course page lists any required knowledge or skills needed before enrollment. We also offer beginner-friendly courses with no prerequisites."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept major credit cards, PayPal, and bank transfers. For corporate training, we can also arrange invoicing options."
              },
              {
                question: "How long do I have access to course materials?",
                answer: "Once enrolled, you have lifetime access to the course materials, including any future updates to the curriculum."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <p className="text-gray-600 dark:text-gray-300">Still have questions?</p>
            <a href="#" className="mt-2 inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300">
              <span>View all FAQs</span>
              <svg className="ml-2 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
