import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = 'max-w-md',
}) => {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // GSAP Entrance
      gsap.fromTo(backdropRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(modalRef.current, 
        { scale: 0.9, y: 30, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' }
      );
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (backdropRef.current === e.target) {
      onClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] bg-bg-dark/85 backdrop-blur-xl flex items-center justify-center p-4 transition-opacity duration-300"
    >
      <div
        ref={modalRef}
        className={`w-full ${maxWidth} glass-card p-8 md:p-10 rounded-[32px] accent-glow relative`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {title && (
          <h2 className="font-heading text-3xl text-on-surface mb-2 tracking-tight">
            {title}
          </h2>
        )}

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
