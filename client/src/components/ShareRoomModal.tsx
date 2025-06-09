import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Copy, X } from "lucide-react";
import { Button, IconButton } from "./atoms";

interface ShareRoomModalProps {
  open: boolean;
  onClose: () => void;
  roomName: string;
  roomId: string;
}

const ShareRoomModal: React.FC<ShareRoomModalProps> = ({
  open,
  onClose,
  roomName,
}) => {
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const shareableUrl = `${window.location.origin}/room/${roomName}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 3000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = shareableUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 3000);
    }
  };

  return (
    <>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-surface border border-slate-700 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-text mb-4 relative"
                  >
                    Share Room
                    <button
                      onClick={onClose}
                      className="absolute right-0 top-0 text-text-muted hover:text-text transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </Dialog.Title>
                  
                  <div className="mt-4">
                    <p className="text-sm text-primary mb-1">Room Name</p>
                    <div className="bg-bg px-4 py-3 rounded-lg text-center font-mono text-lg text-text">
                      {roomName}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-text-muted mb-2">
                      Share this link to invite others:
                    </p>
                    <div className="flex items-center bg-bg border border-slate-700 rounded-lg p-3">
                      <p className="flex-1 text-sm font-mono text-primary break-all mr-2">
                        {shareableUrl}
                      </p>
                      <IconButton
                        onClick={handleCopyLink}
                        size="sm"
                        aria-label="Copy link"
                      >
                        <Copy size={16} />
                      </IconButton>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-xs text-text-muted italic">
                    Anyone with this link can join the room if they have an account.
                  </p>

                  <div className="mt-6 flex gap-2 justify-end">
                    <Button onClick={handleCopyLink} variant="primary">
                      <Copy size={16} className="mr-2" />
                      Copy Link
                    </Button>
                    <Button onClick={onClose} variant="ghost">
                      Close
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Toast notification */}
      <Transition
        show={showCopiedToast}
        as={Fragment}
        enter="transform ease-out duration-150 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
            Room link copied to clipboard!
          </div>
        </div>
      </Transition>
    </>
  );
};

export default ShareRoomModal;