'use client'

import { useState } from 'react'
import { Calendar, Upload, Tv, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

const tvChannels = [
  { value: 'cnn', label: 'CNN' },
  { value: 'bbc', label: 'BBC News' },
  { value: 'fox', label: 'Fox News' },
  { value: 'espn', label: 'ESPN' },
  { value: 'discovery', label: 'Discovery Channel' },
  { value: 'natgeo', label: 'National Geographic' },
  { value: 'comedy-central', label: 'Comedy Central' },
  { value: 'hbo', label: 'HBO' },
  { value: 'netflix', label: 'Netflix' },
  { value: 'prime', label: 'Prime Video' }
]

export default function AsRunPage() {
  const [selectedDate, setSelectedDate] = useState()
  const [selectedChannel, setSelectedChannel] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileSelect = (file) => {
    if (file && file.type === 'text/csv') {
      setSelectedFile(file)
    } else {
      alert('Please select a valid CSV file')
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedDate || !selectedChannel || !selectedFile) {
      alert('Please fill in all fields and select a file')
      return
    }

    setIsUploading(true)
    
    // Simulate upload process
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('As-run data uploaded successfully!')
      
      // Reset form
      setSelectedDate(undefined)
      setSelectedChannel('')
      setSelectedFile(null)
    } catch (error) {
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">As-Run Data Upload</h1>
          <p className="text-gray-600">Upload your television broadcast as-run logs</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-blue-600" />
              Upload As-Run Data
            </CardTitle>
            <CardDescription>
              Select the broadcast date, channel, and upload your CSV file containing as-run information
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Date Selector */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">Broadcast Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Channel Selector */}
            <div className="space-y-2">
              <Label htmlFor="channel" className="text-sm font-medium">TV Channel</Label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a TV channel" />
                </SelectTrigger>
                <SelectContent>
                  {tvChannels.map((channel) => (
                    <SelectItem key={channel.value} value={channel.value}>
                      {channel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file" className="text-sm font-medium">CSV File</Label>
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-lg p-6 transition-colors",
                  dragActive 
                    ? "border-blue-400 bg-blue-50" 
                    : "border-gray-300 hover:border-gray-400"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="text-center">
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FileText className="mx-auto h-8 w-8 text-green-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedFile(null)
                        }}
                      >
                        Remove file
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          Drop your CSV file here, or click to browse
                        </p>
                        <p className="text-xs text-gray-500">CSV files up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Button */}
            <div className="pt-4">
              <Button 
                onClick={handleUpload}
                disabled={!selectedDate || !selectedChannel || !selectedFile || isUploading}
                className="w-full"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload As-Run Data
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">CSV Format Requirements:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Include columns: Time, Program Name, Duration</li>
                  <li>• Use 24-hour time format (HH:MM:SS)</li>
                  <li>• Duration should be in minutes or HH:MM:SS format</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}