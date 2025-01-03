import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (newDate: string, newTime: string) => void;
  currentDate: string;
  currentTime: string;
}

export function RescheduleModal({ isOpen, onClose, onReschedule, currentDate, currentTime }: RescheduleModalProps) {
  const [date, setDate] = useState(currentDate);
  const [time, setTime] = useState(currentTime);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Handle focus trap
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleReschedule = () => {
    onReschedule(date, time);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 
                   w-full max-w-[425px] bg-white rounded-lg shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6">
          <div className="mb-4">
            <h2 id="modal-title" className="text-lg font-semibold">
              Reschedule Meeting
            </h2>
          </div>

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

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleReschedule}>
              Reschedule
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RescheduleModal;