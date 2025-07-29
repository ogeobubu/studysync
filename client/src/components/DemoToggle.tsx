import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Modal } from './ui/modal';
import { Settings, User, Lock, ChevronUp, ChevronDown, Move } from 'lucide-react';
import { http } from '../api/httpEnhanced';
import { initializeDemoData, resetDemoData } from '../services/demoData';

export default function DemoToggle() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Load saved position and demo mode state
  useEffect(() => {
    setIsDemoMode(http.isDemoMode());
    const savedPos = localStorage.getItem('demoTogglePosition');
    if (savedPos) {
      try {
        const pos = JSON.parse(savedPos);
        // Ensure position stays within viewport bounds
        setPosition({
          x: Math.min(pos.x, window.innerWidth - 250),
          y: Math.min(pos.y, window.innerHeight - 100)
        });
      } catch (e) {
        console.error('Failed to parse position', e);
      }
    }
  }, []);

  // Handle touch/mouse down for dragging
  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent) => {
    // Ignore if clicking on interactive elements
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const rect = dragRef.current?.getBoundingClientRect();
    
    if (rect) {
      dragOffset.current = {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }
    e.preventDefault();
  };

  // Handle move events
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const newX = clientX - dragOffset.current.x;
    const newY = clientY - dragOffset.current.y;
    
    // Keep within viewport bounds
    const boundedX = Math.max(0, Math.min(newX, window.innerWidth - (dragRef.current?.offsetWidth || 250)));
    const boundedY = Math.max(0, Math.min(newY, window.innerHeight - (dragRef.current?.offsetHeight || 100)));
    
    setPosition({ x: boundedX, y: boundedY });
  };

  // Handle end of drag
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleEndDrag = () => {
    if (isDragging) {
      setIsDragging(false);
      localStorage.setItem('demoTogglePosition', JSON.stringify(position));
    }
  };

  // Set up event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEndDrag);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEndDrag);
      document.body.style.userSelect = 'none';
      document.body.style.touchAction = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEndDrag);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEndDrag);
      document.body.style.userSelect = '';
      document.body.style.touchAction = '';
    };
  }, [handleEndDrag, handleMove, isDragging, position]);

  const handleToggleDemo = (enabled: boolean) => {
    if (enabled) {
      initializeDemoData();
      localStorage.setItem('demo_mode', 'true');
    } else {
      localStorage.setItem('demo_mode', 'false');
      resetDemoData();
    }
    window.location.reload();
  };

  const containerStyle = {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 9999,
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
    maxWidth: 'calc(100vw - 20px)'
  };

  if (!isDemoMode) {
    return (
      <div
        ref={dragRef}
        style={containerStyle}
        onMouseDown={handleStartDrag}
        onTouchStart={handleStartDrag}
        className="select-none"
      >
        <div className="bg-white rounded-lg shadow-lg border-2 border-blue-200 overflow-hidden w-[250px]">
          <div className="px-3 py-2 flex items-center cursor-move bg-blue-50">
            <Move className="h-4 w-4 mr-2 opacity-70" />
            <span className="text-sm font-medium">Demo Controls</span>
          </div>
          <div className="p-3 no-drag">
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowModal(true)}
              className="w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              Enable Demo Mode
            </Button>
          </div>
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="space-y-4 p-4">
            <h3 className="text-lg font-semibold">Enable Demo Mode</h3>
            <p className="text-sm text-gray-600">
              Demo mode populates the application with sample data for testing and demonstration purposes.
            </p>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <h4 className="font-medium text-blue-900 mb-2">Features:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Pre-configured sample data</li>
                <li>• All application features enabled</li>
                <li>• Test with different user roles</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)} className="no-drag">
                Cancel
              </Button>
              <Button onClick={() => handleToggleDemo(true)} className="no-drag">
                Enable
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div
      ref={dragRef}
      style={containerStyle}
      onMouseDown={handleStartDrag}
      onTouchStart={handleStartDrag}
      className="select-none"
    >
      <div className={`bg-purple-600 text-white rounded-lg shadow-lg ${isMobile ? 'w-full' : 'min-w-[250px]'}`}>
        <div className="px-4 py-2 flex items-center justify-between cursor-move">
          <div className="flex items-center">
            <Badge variant="secondary" className="bg-white text-blue-600 mr-2 no-drag">
              DEMO MODE
            </Badge>
            {!isMobile && <Move className="h-4 w-4 opacity-70" />}
          </div>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="no-drag p-1 rounded hover:bg-white/20"
          >
            {showDetails ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
        
        {showDetails && (
          <div className="px-4 pb-2 border-t border-white/20 no-drag">
            <div className="space-y-2 text-sm mt-2">
              <div className="font-medium">Demo Accounts:</div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  <span className="truncate">Student: student@demo.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  <span className="truncate">Advisor: advisor@demo.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  <span className="truncate">Admin: admin@demo.com</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Lock className="h-3 w-3" />
                  <span>Password: demo123</span>
                </div>
              </div>

              <div className="pt-2 space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    resetDemoData();
                    window.location.reload();
                  }}
                  className="w-full bg-white text-blue-600 hover:bg-gray-100"
                >
                  Reset Demo Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleDemo(false)}
                  className="w-full bg-white text-blue-600 hover:bg-gray-100"
                >
                  Disable Demo Mode
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}