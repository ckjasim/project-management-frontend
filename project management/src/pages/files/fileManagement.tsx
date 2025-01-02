import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Upload, FolderPlus, MoreVertical, FileText, 
  Image, File, Folder, X, Plus, ChevronRight, Check 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchDrivefilesApi } from '@/services/api/api';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const CreateFolderModal = ({ isOpen, onClose, onCreateFolder }) => {
  const [folderName, setFolderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!folderName.trim()) return;
    
    setIsLoading(true);
    await onCreateFolder(folderName);
    setIsLoading(false);
    setFolderName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Folder">
      <div className="space-y-4">
        <div>
          <Input
            autoFocus
            type="text"
            placeholder="Enter folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!folderName.trim() || isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FolderPlus className="w-4 h-4" />
                Create
              </div>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const FileUploadStatus = ({ file, progress }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
    <div className="flex-shrink-0">
      {progress === 100 ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">{file.name}</p>
      <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
    <span className="text-sm text-gray-500">{progress}%</span>
  </div>
);

const DriveIntegration = () => {
  const [folders, setFolders] = useState([
    { id: 1, name: "Project A", files: [
      { name: "file1.pdf", type: "pdf", size: "2.4 MB", lastModified: "2024-12-20" },
      { name: "file2.png", type: "image", size: "1.1 MB", lastModified: "2024-12-21" }
    ]},
    { id: 2, name: "Project B", files: [
      { name: "report.docx", type: "document", size: "892 KB", lastModified: "2024-12-22" }
    ]},
  ]);
  
  useEffect(()=>{
  const  fetchDrivefiles=async()=>{
const res = await fetchDrivefilesApi()
console.log(res,'reefileesss')
    }
    fetchDrivefiles()
  },[])
  const [activeFolder, setActiveFolder] = useState(folders[0]);
  const [files, setFiles] = useState(activeFolder.files);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFolderClick = (folder) => {
    setActiveFolder(folder);
    setFiles(folder.files);
  };

  const simulateFileUpload = (file) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadingFiles(prev => 
          prev.map(f => f.name === file.name ? { ...f, progress } : f)
        );
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
            resolve();
          }, 500);
        }
      }, 300);
    });
  };

  const handleFileUpload = async (uploadedFiles) => {
    const newUploadingFiles = Array.from(uploadedFiles).map(file => ({
      name: file.name,
      progress: 0
    }));
    
    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Simulate upload for each file
    await Promise.all(newUploadingFiles.map(file => simulateFileUpload(file)));

    const newFiles = Array.from(uploadedFiles).map(file => ({
      name: file.name,
      type: file.type.split('/')[1] || 'document',
      size: formatFileSize(file.size),
      lastModified: new Date().toISOString().split('T')[0]
    }));

    const updatedFolders = folders.map(folder => {
      if (folder.id === activeFolder.id) {
        return {
          ...folder,
          files: [...folder.files, ...newFiles]
        };
      }
      return folder;
    });

    setFolders(updatedFolders);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleCreateFolder = async (name) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newFolder = {
      id: folders.length + 1,
      name,
      files: []
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf':
        return <FileText className="text-red-500" />;
      case 'image':
        return <Image className="text-blue-500" />;
      default:
        return <File className="text-gray-500" />;
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Folder className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold">Cloud Drive</h1>
          </div>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              type="text"
              placeholder="Search folders..."
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
          <Button 
            className="w-full mb-4"
            onClick={() => setShowNewFolderModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
        </div>
        <div className="px-4">
          <h2 className="px-2 py-2 text-sm font-semibold text-gray-500 uppercase">Folders</h2>
          <ul className="space-y-1">
            {folders.map((folder) => (
              <li
                key={folder.id}
                className={`flex items-center p-2 rounded-lg cursor-pointer transition-all ${
                  activeFolder.id === folder.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => handleFolderClick(folder)}
              >
                <ChevronRight className={`w-4 h-4 mr-2 transition-transform ${
                  activeFolder.id === folder.id ? "rotate-90" : ""
                }`} />
                <span>{folder.name}</span>
                <span className="ml-auto text-xs text-gray-400">
                  {folder.files.length}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-8 overflow-auto">
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{activeFolder.name}</h1>
                <p className="text-sm text-gray-500">
                  {files.length} files • Last updated {files[0]?.lastModified}
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-dashed"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                />
              </div>
            </div>

            {/* Upload Status */}
            {uploadingFiles.length > 0 && (
              <div className="mb-6 space-y-2">
                {uploadingFiles.map((file, index) => (
                  <FileUploadStatus 
                    key={index}
                    file={file}
                    progress={file.progress}
                  />
                ))}
              </div>
            )}

            {/* Drag & Drop Zone */}
            <div
              className={`mb-8 rounded-lg border-2 border-dashed transition-all ${
                isDragging 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 bg-gray-50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center p-8">
                <Upload className={`w-12 h-12 mb-4 ${
                  isDragging ? "text-blue-500" : "text-gray-400"
                }`} />
                <p className="text-sm text-gray-600">
                  {isDragging 
                    ? "Drop your files here" 
                    : "Drag and drop your files here, or click upload"}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search files..."
                className="pl-10 bg-gray-50 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* File List */}
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Modified</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredFiles.length > 0 ? (
                    filteredFiles.map((file, index) => (
                      <tr key={index} className="group hover:bg-gray-50">
                      <td className="px-6 py-4 flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <span className="text-sm font-medium text-gray-900">{file.name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{file.size}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{file.lastModified}</td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <File className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-sm text-gray-500">No files found in this folder</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Upload files or create a new folder to get started
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>

    {/* Create Folder Modal */}
    <CreateFolderModal
      isOpen={showNewFolderModal}
      onClose={() => setShowNewFolderModal(false)}
      onCreateFolder={handleCreateFolder}
    />
  </div>
);
};

export default DriveIntegration;