'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Instagram, Linkedin, Mail, Code2, Award, School, Heart } from 'lucide-react';

export default function DeveloperProfile() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

 return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className={`max-w-2xl w-full ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
        <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
          {/* Header dengan gradient background */}
          <div className="h-40 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 relative">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBjMCAyLjIwOS0xLjc5MSA0LTQgNHMtNC0xLjc5MS00LTR2LTRoNHY0aDR2LTRoLTR2NHY0aDRjMi4yMDkgMCA0LTEuNzkxIDQtNHM0LTEuNzkxIDQtNHYtNGgtNHY0aC00djRoLTR2LTR6Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
          </div>

          <CardContent className="px-8 pb-8">
            {/* Profile Section */}
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-4xl font-bold">
                  AA
                </div>
              </div>

              <div className="text-center mt-4 space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Alfarisi Azmir
                </h1>
                <p className="text-lg text-blue-700 font-semibold">Full-Stack Developer</p>
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <School className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Siswa SMKN 8 JAKARTA</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-3 mb-8">
              <a
                href="https://instagram.com/farhsvvn_"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </Button>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Button
                  size="icon"
                  variant="outline"
                  className="h-12 w-12 rounded-full border-2 border-slate-300 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-110"
                >
                  <Github className="w-5 h-5 text-slate-700 group-hover:text-blue-600" />
                </Button>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Button
                  size="icon"
                  variant="outline"
                  className="h-12 w-12 rounded-full border-2 border-slate-300 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="w-5 h-5 text-slate-700 group-hover:text-blue-600" />
                </Button>
              </a>
              <a
                href="mailto:contact@alfarisi.dev"
                className="group"
              >
                <Button
                  size="icon"
                  variant="outline"
                  className="h-12 w-12 rounded-full border-2 border-slate-300 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-110"
                >
                  <Mail className="w-5 h-5 text-slate-700 group-hover:text-blue-600" />
                </Button>
              </a>
            </div>

            {/* Stats/Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 text-center">
                  <Code2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold text-blue-700">Full-Stack</p>
                  <p className="text-sm text-slate-600">Developer</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold text-blue-700">SMKN 8</p>
                  <p className="text-sm text-slate-600">Jakarta</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 text-center">
                  <Heart className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold text-blue-700">Coding</p>
                  <p className="text-sm text-slate-600">Passionate</p>
                </CardContent>
              </Card>
            </div>

            {/* Project Badge */}
            <div className="text-center space-y-3">
              <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 border-none">
                <CardContent className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
                    <Code2 className="w-6 h-6" />
                    SiHebat8
                  </h3>
                  <p className="text-blue-100 mb-3">Sistem Absensi Digital SMKN 8 Jakarta</p>
                  <p className="text-sm text-blue-200 italic">
                    "Hadir Tepat, Data Akurat, Sekolah Hebat"
                  </p>
                </CardContent>
              </Card>

              <p className="text-slate-500 text-sm">
                Built with ❤️ using Next.js 16, TypeScript, & Tailwind CSS
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-white/80 text-sm">
          <p>© 2025 Alfarisi Azmir. All rights reserved.</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
