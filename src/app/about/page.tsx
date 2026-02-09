"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Users,
  Award,
  MapPin,
  Mail,
  Phone,
  Clock,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";

const stats = [
  { label: "Happy Customers", value: "50K+", icon: Users },
  { label: "Devices Sold", value: "120K+", icon: Smartphone },
  { label: "Years Experience", value: "8+", icon: Award },
];

const values = [
  {
    icon: Shield,
    title: "100% Authentic",
    description: "Every device we sell is brand new and comes directly from authorized suppliers.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Same-day shipping on orders placed before 2 PM. Free shipping on all orders over $99.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Not satisfied? Return your device within 30 days for a full refund, no questions asked.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our expert team is available around the clock to help you with any questions.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            About{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Eri Mobile
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-500">
            We started with a simple mission: make premium technology accessible to everyone. Today, Eri Mobile Shop is one of the most trusted destinations for iPhones and Apple accessories, serving thousands of happy customers worldwide.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="flex flex-col items-center rounded-3xl bg-gray-50 p-8 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600">
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <span className="mt-4 text-3xl font-bold text-gray-900">
                {stat.value}
              </span>
              <span className="mt-1 text-sm text-gray-500">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Why Choose Us
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Promise to You
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <value.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Get in Touch
              </h2>
              <p className="mt-3 text-lg text-gray-500">
                Have questions? We&apos;d love to hear from you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3"
            >
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "hello@erimobile.com",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+1 (555) 123-4567",
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value: "New York, NY",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center rounded-2xl bg-gray-50 p-6"
                >
                  <item.icon className="h-5 w-5 text-blue-600" />
                  <span className="mt-3 text-sm font-semibold text-gray-900">
                    {item.label}
                  </span>
                  <span className="mt-1 text-sm text-gray-500">
                    {item.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
