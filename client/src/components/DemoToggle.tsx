import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Modal } from './ui/modal';
import { Settings, User, Lock } from 'lucide-react';
import { http } from '../api/httpEnhanced';

export default function DemoToggle() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsDemoMode(http.isDemoMode());
  }, []);

  const handleToggleDemo = (enabled: boolean) => {
    http.toggleDemoMode(enabled);
  };

  if (!isDemoMode) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowModal(true)}
          className="bg-white shadow-lg border-2 border-blue-200 hover:border-blue-300"
        >
          <Settings className="h-4 w-4 mr-2" />
          Enable Demo
        </Button>

        {showModal && (
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Enable Demo Mode</h3>
              <p className="text-sm text-gray-600">
                Demo mode allows you to explore the application with sample data without connecting to a real server. 
                This is perfect for testing and demonstrations.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleToggleDemo(true)}>
                  Enable Demo Mode
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="bg-white text-blue-600">
            DEMO MODE
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="font-medium">Demo Accounts:</div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <span className="text-xs">Student: john.student@demo.com</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <span className="text-xs">Advisor: sarah.advisor@demo.com</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <span className="text-xs">Admin: michael.admin@demo.com</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Lock className="h-3 w-3" />
              <span className="text-xs">Password: any password works</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleDemo(false)}
            className="w-full mt-2 bg-white text-blue-600 hover:bg-gray-100"
          >
            Disable Demo Mode
          </Button>
        </div>
      </div>
    </div>
  );
}