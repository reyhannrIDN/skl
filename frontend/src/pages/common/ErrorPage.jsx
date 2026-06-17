import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { AlertTriangle, ShieldAlert, FileQuestion, ServerCrash, Clock, Ban, Activity } from 'lucide-react';

export function ErrorPage({ code: propCode }) {
  const { code: paramCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use prop code if provided (e.g., direct render), otherwise use URL param
  const statusCode = propCode || paramCode || '404';

  const errorDetails = {
    '400': {
      title: 'Bad Request',
      message: 'Permintaan tidak dapat diproses oleh server karena format yang salah.',
      icon: <AlertTriangle className="w-20 h-20 text-warning" />,
      color: 'text-warning'
    },
    '401': {
      title: 'Unauthorized',
      message: 'Anda tidak memiliki akses yang valid. Silakan login kembali.',
      icon: <ShieldAlert className="w-20 h-20 text-destructive" />,
      color: 'text-destructive',
      action: () => navigate('/login')
    },
    '403': {
      title: 'Forbidden',
      message: 'Akses ditolak. Anda tidak memiliki izin untuk melihat halaman ini.',
      icon: <Ban className="w-20 h-20 text-destructive" />,
      color: 'text-destructive'
    },
    '404': {
      title: 'Not Found',
      message: 'Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.',
      icon: <FileQuestion className="w-20 h-20 text-muted-foreground" />,
      color: 'text-foreground'
    },
    '419': {
      title: 'Page Expired',
      message: 'Sesi Anda telah berakhir. Silakan muat ulang halaman atau login kembali.',
      icon: <Clock className="w-20 h-20 text-warning" />,
      color: 'text-warning'
    },
    '422': {
      title: 'Unprocessable Entity',
      message: 'Data yang dikirimkan tidak valid atau tidak dapat diproses.',
      icon: <AlertTriangle className="w-20 h-20 text-warning" />,
      color: 'text-warning'
    },
    '429': {
      title: 'Too Many Requests',
      message: 'Anda telah mengirimkan terlalu banyak permintaan. Silakan tunggu beberapa saat.',
      icon: <Activity className="w-20 h-20 text-warning" />,
      color: 'text-warning'
    },
    '500': {
      title: 'Internal Server Error',
      message: 'Terjadi kesalahan sistem pada server. Tim kami sedang menanganinya.',
      icon: <ServerCrash className="w-20 h-20 text-destructive" />,
      color: 'text-destructive'
    },
    '503': {
      title: 'Service Unavailable',
      message: 'Layanan saat ini tidak tersedia (mungkin sedang dalam perbaikan). Coba lagi nanti.',
      icon: <ServerCrash className="w-20 h-20 text-muted-foreground" />,
      color: 'text-foreground'
    }
  };

  const details = errorDetails[statusCode] || errorDetails['404'];

  const goBackUrl = location.state?.from || '/';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="mb-8 animate-in zoom-in duration-500">
        <div className="relative flex items-center justify-center">
          <div className="absolute opacity-10 blur-3xl rounded-full w-40 h-40 bg-current" style={{ backgroundColor: 'inherit' }}></div>
          {details.icon}
        </div>
      </div>
      
      <h1 className={`text-6xl md:text-8xl font-black font-display tracking-tighter mb-4 ${details.color}`}>
        {statusCode}
      </h1>
      
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
        {details.title}
      </h2>
      
      <p className="text-muted-foreground max-w-[500px] mb-8 text-lg">
        {details.message}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          size="lg" 
          onClick={() => details.action ? details.action() : navigate(-1)}
          variant="outline"
        >
          Kembali ke Sebelumnya
        </Button>
        <Button 
          size="lg" 
          onClick={() => navigate('/')}
        >
          Ke Beranda
        </Button>
      </div>
    </div>
  );
}
