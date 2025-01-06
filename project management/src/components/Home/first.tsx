import React from 'react';
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const First = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold mb-2">
          Why choose <span className="text-gray-400">TaskHive</span>?
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Decide if you want to throw it away or retain it and continue with your workflow unhindered. Need short bursts of productivity?
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
        <div className="space-y-8">
          {/* <Badge variant="outline" className="bg-white border-purple-200 text-purple-600 px-4 py-1">
            Task Management
          </Badge> */}

          <h2 className="text-3xl font-bold">
            Efficiently manage your tasks with our intuitive interface.
          </h2>

          <p className="text-gray-600">
            Stay organised, track progress seamlessly, and accomplish more with tools designed to simplify your workflow.
          </p>

          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-600"></div>
              <span>Assign tasks and manage deadlines.</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-600"></div>
              <span>Prioritize tasks and keep your team aligned.</span>
            </li>
          </ul>

          <Button className="bg-purple-600 text-white hover:bg-purple-700">
            Start for free
          </Button>
        </div>

        <div className="relative">
          <div className="absolute -top-4 -right-4">
            <img 
              src="/api/placeholder/40/40"
              alt="User avatar"
              className="rounded-full border-2 border-white"
            />
          </div>
          <Card className="bg-white p-6 rounded-xl shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <img 
                    src="/api/placeholder/32/32"
                    alt="User avatar"
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-medium">Tony Hawkins</div>
                    <div className="text-sm text-gray-500">Staff</div>
                  </div>
                </div>
                <div className="font-semibold">$725.65</div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <img 
                    src="/api/placeholder/32/32"
                    alt="User avatar"
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-medium">Marvin McKinney</div>
                    <div className="text-sm text-gray-500">Staff</div>
                  </div>
                </div>
                <div className="font-semibold">$770.85</div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <img 
                    src="/api/placeholder/32/32"
                    alt="User avatar"
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-medium">Devon Lane</div>
                    <div className="text-sm text-gray-500">Staff</div>
                  </div>
                </div>
                <div className="font-semibold">$943.65</div>
              </div>

              <div className="h-32 w-full bg-gray-50 rounded-lg">
                <div className="flex items-end h-full justify-around px-4 pb-4">
                  <div className="w-8 bg-blue-500 h-16"></div>
                  <div className="w-8 bg-purple-500 h-24"></div>
                  <div className="w-8 bg-blue-500 h-12"></div>
                  <div className="w-8 bg-purple-500 h-28"></div>
                  <div className="w-8 bg-blue-500 h-16"></div>
                  <div className="w-8 bg-purple-500 h-20"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default First;