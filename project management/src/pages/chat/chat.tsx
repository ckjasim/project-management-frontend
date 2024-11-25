// import React from 'react';
// import { FiClock, FiMoreHorizontal, FiSend } from 'react-icons/fi';
// import { BsPersonCircle } from 'react-icons/bs';
// import { RiAttachment2 } from 'react-icons/ri';

// // Define the types for the data
// type Message = {
//   sender: string;
//   timestamp: string;
//   text: string;
//   attachments?: { name: string; size: string }[];
// };

// type User = {
//   name: string;
//   image: string;
//   online: number;
// };

// const DesignTeamPage: React.FC = () => {
//   // Sample data
//   const messages: Message[] = [
//     {
//       sender: 'Killian James',
//       timestamp: '10:12 AM',
//       text: 'Hi, Are you still Web Designer, would love to see some Design 😊',
//     },
//     {
//       sender: 'Claudia Maudi',
//       timestamp: '10:30 AM',
//       text: 'Hey, happy to hear from you. Yes, I will be back in a couple to days.',
//       attachments: [
//         { name: 'Very important file.figma', size: '7.5 MB' },
//         { name: 'Some file.scratch', size: '2.5 MB' },
//         { name: 'List of something.xd', size: '7.5 MB' },
//         { name: 'Very important file.svg', size: '7.5 MB' },
//       ],
//     },
//     {
//       sender: 'Millie Nose',
//       timestamp: '8:20 PM',
//       text: 'Great 👍 That's a nice design idea. 😊',
//     },
//   ];

//   const users: User[] = [
//     { name: 'Novita', image: '', online: 1 },
//     { name: 'Millie Nose', image: '', online: 1 },
//     { name: 'Ikhsan SD', image: '', online: 0 },
//     { name: 'Aditya', image: '', online: 0 },
//   ];

//   return (
//     <div className="flex h-screen">
//       {/* Messages sidebar */}
//       <div className="w-1/3 bg-gray-100 border-r">
//         <div className="p-4 border-b">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="space-y-4 p-4">
//           {messages.map((message, index) => (
//             <div key={index} className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <BsPersonCircle className="text-gray-500 h-8 w-8" />
//                 <div>
//                   <p className="font-medium">{message.sender}</p>
//                   <p className="text-gray-500 text-sm">{message.text}</p>
//                 </div>
//               </div>
//               <p className="text-gray-500 text-sm">
//                 <FiClock className="inline-block mr-1" />
//                 {message.timestamp}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Design team section */}
//       <div className="flex-1 bg-white">
//         <div className="flex items-center justify-between p-4 border-b">
//           <div className="flex items-center space-x-2">
//             <BsPersonCircle className="text-gray-500 h-10 w-10" />
//             <div>
//               <p className="font-medium">Design Team</p>
//               <p className="text-gray-500 text-sm">{users.length} member, {users.filter(user => user.online > 0).length} online</p>
//             </div>
//           </div>
//           <FiMoreHorizontal className="text-gray-500 h-6 w-6 cursor-pointer" />
//         </div>
//         <div className="p-4 space-y-4">
//           {messages.map((message, index) => (
//             <div key={index} className="flex items-start space-x-2">
//               <BsPersonCircle className="text-gray-500 h-10 w-10" />
//               <div className="flex-1">
//                 <p className="font-medium">{message.sender}</p>
//                 <p className="text-gray-500 text-sm">{message.timestamp}</p>
//                 <p className="mt-2">{message.text}</p>
//                 {message.attachments && (
//                   <div className="mt-2 space-y-2">
//                     {message.attachments.map((attachment, i) => (
//                       <div key={i} className="flex items-center justify-between bg-gray-100 rounded-md p-2">
//                         <div className="flex items-center space-x-2">
//                           <RiAttachment2 className="text-gray-500 h-6 w-6" />
//                           <div>
//                             <p className="font-medium">{attachment.name}</p>
//                             <p className="text-gray-500 text-sm">{attachment.size}</p>
//                           </div>
//                         </div>
//                         <FiSend className="text-gray-500 h-6 w-6 cursor-pointer" />
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DesignTeamPage;


import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserSideBar from '@/components/chat/UserSideBar';
import ChatArea from '@/components/chat/chatArea';
import DetailsSidebar from '@/components/chat/detailesSideBar';

const MessagesPage = () => {
  // const teams = [
  //   { name: 'Testing team', lastMessage: 'Typing...', time: '4:30 PM', isTyping: true },
  //   { name: 'Design Team', lastMessage: 'Hello! Everyone', time: '9:36 AM' },
  //   { name: 'Development team', lastMessage: 'Wow really Cool 🔥', time: '1:15 AM' },
  // ];
 
  const attachments = [
    { name: 'Very important file.fig', type: 'figma', size: '7.5 MB', timestamp: '3.22.22, 11:15 AM' },
    { name: 'Some file.scratch', type: 'scratch', size: '7.5 MB', timestamp: '3.22.22, 11:15 AM' },
    { name: 'List of something.xd', type: 'xd', size: '7.5 MB', timestamp: '3.22.22, 11:15 AM' },
  ];
  
  const members = ['Novita', 'Millie Nose', 'Ikhsan SD', 'Aditya'];
  return (
    <div className="flex h-screen">
      <UserSideBar/>
      <ChatArea />
      <DetailsSidebar attachments={attachments} members={members} />
    </div>
  );
};

export default MessagesPage;