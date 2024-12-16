import { Attachment } from '@/types';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiDownload } from 'react-icons/fi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DetailsSidebarProps {
  attachments: Attachment[];
  members: string[];
}

const DetailsSidebar: React.FC<DetailsSidebarProps> = ({ attachments, members }) => {
  return (
    <Card className="h-full flex-1 flex-col  rounded-3xl shadow-lg">
      <CardHeader className="bg-gray-100 p-6 ">
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Attachments</h3>
          <ul className="space-y-3">
            {attachments.map((attachment, index) => (
              <li
                key={index}
                className="bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow flex justify-between items-center"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{attachment.name}</p>
                  <p className="text-sm text-gray-500">{attachment.size}</p>
                </div>
                <Button variant="secondary" className="rounded-full">
                  <FiDownload className="text-gray-500" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Members</h3>
          <div className="grid grid-cols-4 gap-4">
            {members.map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                <Avatar>
                  <AvatarImage src='' />
                  <AvatarFallback>{member.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium text-gray-700 mt-2">{member}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailsSidebar;