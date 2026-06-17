import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { siswaApi } from '@/api/siswaApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Edit, Download, FileArchive, FileVideo, Image as ImageIcon, CheckCircle2, AlertCircle, Clock, ExternalLink, Cloud, Eye } from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export function SubmissionDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [slug]);

  const fetchDetail = async () => {
    try {
      const { data } = await siswaApi.getSubmission(slug);
      setSubmission(data.submission);
    } catch (error) {
      toast.error('Gagal mengambil detail submission');
      navigate('/siswa/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { label: 'Draft', variant: 'secondary', icon: Clock },
      submitted: { label: 'Menunggu Review', variant: 'default', icon: Clock },
      under_review: { label: 'Dalam Review', variant: 'warning', icon: AlertCircle },
      revision: { label: 'Perlu Revisi', variant: 'destructive', icon: AlertCircle },
      approved: { label: 'Disetujui', variant: 'success', icon: CheckCircle2 },
      skl_issued: { label: 'SKL Diterbitkan', variant: 'success', icon: CheckCircle2 },
    };
    const Info = statusMap[status] || statusMap.draft;
    const Icon = Info.icon;
    return (
      <Badge variant={Info.variant} className="flex items-center gap-1.5 py-1 px-3">
        <Icon className="w-3.5 h-3.5" />
        {Info.label}
      </Badge>
    );
  };

  const getFileIcon = (type, requirementType) => {
    if (requirementType === 'link') return <ExternalLink className="w-5 h-5 text-indigo-500" />;
    if (requirementType === 'drive_file') return <Cloud className="w-5 h-5 text-blue-600" />;

    switch (type) {
      case 'poster':
      case 'screenshot': return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case 'apk': return <Download className="w-5 h-5 text-green-500" />;
      case 'source_zip':
      case 'kodular_aia': return <FileArchive className="w-5 h-5 text-amber-500" />;
      case 'video': return <FileVideo className="w-5 h-5 text-red-500" />;
      default: return <Download className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const handleDownload = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-4"><div className="h-32 bg-card rounded-xl"></div><div className="h-64 bg-card rounded-xl"></div></div>;
  }

  if (!submission) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Button variant="ghost" onClick={() => navigate('/siswa/dashboard')} className="gap-2 -ml-4 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-primary mb-2">Detail Project</h1>
          {getStatusBadge(submission.status)}
        </div>
        
        {/* Actions based on status */}
        <div className="flex gap-2 w-full md:w-auto">
          {(!submission.is_locked && submission.status !== 'approved' && submission.status !== 'skl_issued') && (
            <Button onClick={() => navigate(`/siswa/submission/${submission.slug}/edit`)} className="gap-2 flex-1 md:flex-none">
              <Edit className="w-4 h-4" /> Edit Submission
            </Button>
          )}
          {submission.status === 'skl_issued' && submission.skl_drive_link && (
            <Button 
              variant="success" 
              className="gap-2 flex-1 md:flex-none text-white bg-success hover:bg-success/90"
              onClick={() => window.open(submission.skl_drive_link, '_blank')}
            >
              <Download className="w-4 h-4" /> Download SKL Saya
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-2xl">{submission.judul_project}</CardTitle>
              <CardDescription>Pembimbing: {submission.nama_pembimbing}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Deskripsi</h3>
                <p className="text-base whitespace-pre-wrap">{submission.deskripsi_project}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Teknologi</h3>
                <div className="flex flex-wrap gap-2">
                  {(submission.teknologi_digunakan || []).map((tech, idx) => (
                    <Badge key={idx} variant="secondary">{tech}</Badge>
                  ))}
                  {(!submission.teknologi_digunakan || submission.teknologi_digunakan.length === 0) && (
                    <span className="text-sm italic text-muted-foreground">Tidak ditentukan</span>
                  )}
                </div>
              </div>

              {/* Revision Notes if any */}
              {submission.status === 'revision' && submission.catatan_guru && (
                 <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                   <h4 className="flex items-center gap-2 text-destructive font-semibold mb-2">
                     <AlertCircle className="w-5 h-5" /> Catatan Revisi dari Pembimbing
                   </h4>
                   <p className="text-sm">{submission.catatan_guru}</p>
                 </div>
              )}
            </CardContent>
          </Card>

          {/* Files List */}
          <Card>
            <CardHeader className="pb-4 border-b bg-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileArchive className="w-5 h-5" /> Berkas Unggahan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {submission.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:border-primary/50 transition-colors">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="p-2 bg-secondary rounded-md shrink-0">
                        {getFileIcon(file.file_type, file.requirement?.type)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate" title={file.file_name}>{file.file_name}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase">
                          <span>{file.requirement?.label || file.file_type.replace('_', ' ')}</span>
                          {file.requirement?.type === 'local_file' && (
                            <>
                              <span>•</span>
                              <span>{(file.file_size / 1024 / 1024).toFixed(2)} MB</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-primary hover:bg-primary/10"
                        onClick={() => window.open(file.file_url, '_blank')}
                        title="Lihat"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {file.requirement?.type !== 'link' && file.requirement?.type !== 'url' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:bg-muted"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = file.file_url;
                            link.download = file.file_name;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}

                      { (file.requirement?.type === 'link' || file.requirement?.type === 'url') && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:bg-muted"
                          onClick={() => window.open(file.link_url || file.file_url, '_blank')}
                          title="Buka Link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {submission.files.length === 0 && (
                  <div className="col-span-full text-center py-6 text-muted-foreground italic bg-muted/20 rounded-lg">
                    Belum ada file yang diunggah.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Status & Checklist */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b bg-muted/20">
              <CardTitle className="text-lg">Progress Review</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Disubmit pada</span>
                <span className="font-medium">{dayjs(submission.created_at).format('DD MMM YYYY, HH:mm')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Diupdate pada</span>
                <span className="font-medium">{dayjs(submission.updated_at).format('DD MMM YYYY, HH:mm')}</span>
              </div>

              {submission.status === 'skl_issued' && (
                <div className="mt-4 p-4 bg-success/15 border border-success/30 rounded-lg text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-success mx-auto" />
                  <h4 className="font-bold text-success-foreground">Selamat!</h4>
                  <p className="text-sm">SKL Anda telah diterbitkan.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Checklist Preview for Siswa */}
          {submission.checklistReviews && submission.checklistReviews.length > 0 && (
            <Card>
              <CardHeader className="pb-4 border-b bg-muted/20">
                <CardTitle className="text-lg">Checklist Penilaian</CardTitle>
                <CardDescription>Status pengecekan oleh guru</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {submission.checklistReviews.map((review) => (
                  <div key={review.id} className="flex flex-col gap-1 pb-3 border-b last:border-0 last:pb-0">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-sm font-medium">{review.checklist_item}</span>
                      {review.status === 'approved' && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
                      {review.status === 'rejected' && <AlertCircle className="w-4 h-4 text-destructive shrink-0" />}
                      {review.status === 'pending' && <Clock className="w-4 h-4 text-muted-foreground shrink-0" />}
                    </div>
                    {review.catatan && (
                       <p className="text-xs text-muted-foreground italic bg-muted/30 p-2 rounded mt-1">
                         Catatan: {review.catatan}
                       </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
