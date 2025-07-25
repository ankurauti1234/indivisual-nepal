import React, { useState } from 'react';
import { Download, X } from 'lucide-react';

const DownloadDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const downloadOptions = [
    {
      name: 'Avenues',
      url: 'https://radio-clips.s3.ap-south-1.amazonaws.com/csv/avenues.csv',
      description: 'Download Avenues channel data'
    },
    {
      name: 'Himalaya',
      url: 'https://radio-clips.s3.ap-south-1.amazonaws.com/csv/himalaya.csv',
      description: 'Download Himalaya channel data'
    }
  ];

  const handleDownload = (url, fileName) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  return (
    <>
      {/* Download Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        <Download className="h-4 w-4" />
        Download
      </button>

      {/* Dialog Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border rounded-lg shadow-lg w-full max-w-md mx-4">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Download Channel Data</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-muted rounded-md transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Select a channel to download its CSV data:
              </p>
              
              <div className="space-y-2">
                {downloadOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => handleDownload(option.url, `${option.name.toLowerCase()}.csv`)}
                    className="w-full p-3 text-left border rounded-md hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {option.description}
                        </div>
                      </div>
                      <Download className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DownloadDialog;