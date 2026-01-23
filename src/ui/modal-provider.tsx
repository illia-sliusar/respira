import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { Modal, AlertModal, ConfirmModal, type ModalVariant } from "./modal";

// Alert options
interface AlertOptions {
  title: string;
  message?: string;
  variant?: ModalVariant;
  buttonText?: string;
}

// Confirm options
interface ConfirmOptions {
  title: string;
  message?: string;
  variant?: ModalVariant;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "danger";
}

// Custom modal options
interface CustomModalOptions {
  title?: string;
  message?: string;
  variant?: ModalVariant;
  icon?: string;
  content?: React.ReactNode;
  buttons?: Array<{
    text: string;
    variant?: "primary" | "secondary" | "danger" | "ghost";
    action?: string;
  }>;
  dismissable?: boolean;
}

// Modal context type
interface ModalContextType {
  showAlert: (options: AlertOptions) => Promise<void>;
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
  showCustom: (options: CustomModalOptions) => Promise<string | null>;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

// Provider component
export function ModalProvider({ children }: { children: React.ReactNode }) {
  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertOptions, setAlertOptions] = useState<AlertOptions | null>(null);
  const alertResolveRef = useRef<(() => void) | null>(null);

  // Confirm state
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(null);
  const confirmResolveRef = useRef<((value: boolean) => void) | null>(null);

  // Custom modal state
  const [customVisible, setCustomVisible] = useState(false);
  const [customOptions, setCustomOptions] = useState<CustomModalOptions | null>(null);
  const customResolveRef = useRef<((value: string | null) => void) | null>(null);

  // Show alert
  const showAlert = useCallback((options: AlertOptions): Promise<void> => {
    return new Promise((resolve) => {
      alertResolveRef.current = resolve;
      setAlertOptions(options);
      setAlertVisible(true);
    });
  }, []);

  // Hide alert
  const hideAlert = useCallback(() => {
    setAlertVisible(false);
    setAlertOptions(null);
    if (alertResolveRef.current) {
      alertResolveRef.current();
      alertResolveRef.current = null;
    }
  }, []);

  // Show confirm
  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmResolveRef.current = resolve;
      setConfirmOptions(options);
      setConfirmVisible(true);
    });
  }, []);

  // Handle confirm result
  const handleConfirm = useCallback((result: boolean) => {
    setConfirmVisible(false);
    setConfirmOptions(null);
    if (confirmResolveRef.current) {
      confirmResolveRef.current(result);
      confirmResolveRef.current = null;
    }
  }, []);

  // Show custom modal
  const showCustom = useCallback((options: CustomModalOptions): Promise<string | null> => {
    return new Promise((resolve) => {
      customResolveRef.current = resolve;
      setCustomOptions(options);
      setCustomVisible(true);
    });
  }, []);

  // Handle custom modal result
  const handleCustomResult = useCallback((action: string | null) => {
    setCustomVisible(false);
    setCustomOptions(null);
    if (customResolveRef.current) {
      customResolveRef.current(action);
      customResolveRef.current = null;
    }
  }, []);

  // Hide any modal
  const hideModal = useCallback(() => {
    hideAlert();
    handleConfirm(false);
    handleCustomResult(null);
  }, [hideAlert, handleConfirm, handleCustomResult]);

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm, showCustom, hideModal }}>
      {children}

      {/* Alert Modal */}
      {alertOptions && (
        <AlertModal
          visible={alertVisible}
          onClose={hideAlert}
          title={alertOptions.title}
          message={alertOptions.message}
          variant={alertOptions.variant}
          buttonText={alertOptions.buttonText}
        />
      )}

      {/* Confirm Modal */}
      {confirmOptions && (
        <ConfirmModal
          visible={confirmVisible}
          onClose={() => handleConfirm(false)}
          onConfirm={() => handleConfirm(true)}
          title={confirmOptions.title}
          message={confirmOptions.message}
          variant={confirmOptions.variant}
          confirmText={confirmOptions.confirmText}
          cancelText={confirmOptions.cancelText}
          confirmVariant={confirmOptions.confirmVariant}
        />
      )}

      {/* Custom Modal */}
      {customOptions && (
        <Modal
          visible={customVisible}
          onClose={() => handleCustomResult(null)}
          title={customOptions.title}
          message={customOptions.message}
          variant={customOptions.variant}
          dismissable={customOptions.dismissable ?? true}
          buttons={customOptions.buttons?.map((btn) => ({
            text: btn.text,
            variant: btn.variant,
            onPress: () => handleCustomResult(btn.action ?? btn.text),
          }))}
        >
          {customOptions.content}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}

// Hook to use modal
export function useModal(): ModalContextType {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
