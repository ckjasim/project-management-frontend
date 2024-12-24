import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RescheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onReschedule: (newDate: string, newTime: string) => void
  currentDate: string
  currentTime: string
}

export function RescheduleModal({ isOpen, onClose, onReschedule, currentDate, currentTime }: RescheduleModalProps) {
  const [date, setDate] = useState(currentDate)
  const [time, setTime] = useState(currentTime)

  const handleReschedule = () => {
    onReschedule(date, time)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reschedule Meeting</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-gray-700">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl border-slate-200 
                           bg-slate-50/99 focus:border-indigo-500 focus:ring-1 
                           focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <Label htmlFor="time" className="text-gray-700">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl border-slate-200 
                           bg-slate-50/99 focus:border-indigo-500 focus:ring-1
                           focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleReschedule}>Reschedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

