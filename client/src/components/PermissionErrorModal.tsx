import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Mic, MicOff, Video, VideoOff, RefreshCw } from "lucide-react";
import { Button } from "./atoms";

interface PermissionErrorModalProps {
  open: boolean;
  onClose: () => void;
  onRetry: () => void;
  errorType: 'denied' | 'notfound' | 'other';
  mediaType: 'audio' | 'video';
}

const PermissionErrorModal: React.FC<PermissionErrorModalProps> = ({
  open,
  onClose,
  onRetry,
  errorType,
  mediaType,
}) => {
  const getInstructions = () => {
    const permission = mediaType === 'audio' ? 'microphone' : 'camera';
    return `Click the 🎤 or ℹ️ icon in address bar → Allow ${permission}`;
  };

  const getErrorContent = () => {
    const isAudio = mediaType === 'audio';
    const deviceName = isAudio ? 'Microphone' : 'Camera';

    switch (errorType) {
      case 'denied':
        return {
          icon: isAudio ? <MicOff className="text-red-500" size={48} /> : <VideoOff className="text-red-500" size={48} />,
          title: `${deviceName} Access ${isAudio ? 'Required' : 'Needed'}`,
          message: `${getInstructions()}${isAudio ? ', then refresh this page' : ', then try again'}.`,
        };
      case 'notfound':
        return {
          icon: isAudio ? <Mic className="text-yellow-500" size={48} /> : <Video className="text-yellow-500" size={48} />,
          title: `No ${deviceName} Found`,
          message: `Please connect a ${deviceName.toLowerCase()} to your device and try again.`,
        };
      default:
        return {
          icon: isAudio ? <MicOff className="text-red-500" size={48} /> : <VideoOff className="text-red-500" size={48} />,
          title: `Unable to Access ${deviceName}`,
          message: `There was an error accessing your ${deviceName.toLowerCase()}. Please check your device settings.`,
        };
    }
  };

  const { icon, title, message } = getErrorContent();
  const isAudio = mediaType === 'audio';

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-150"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-surface border border-slate-700 p-6 text-center align-middle shadow-xl transition-all">
                <div className="mb-4 flex justify-center">
                  {icon}
                </div>

                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-text mb-4">
                  {title}
                </Dialog.Title>

                <p className="text-sm text-text-muted mb-6">
                  {message}
                </p>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-center">
                    <Button
                      onClick={isAudio ? () => window.location.reload() : onRetry}
                      variant="primary"
                      className="flex items-center justify-center"
                    >
                      <RefreshCw size={16} className="mr-2" />
                      {isAudio ? 'Refresh Page' : 'Try Again'}
                    </Button>
                  </div>
                  <div className="flex justify-center">
                    <Button onClick={onClose} variant="ghost">
                      Go Back
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PermissionErrorModal;