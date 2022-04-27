import React, { createContext, useCallback, useState } from "react";
import styled from "styled-components";

interface ModalsContext {
  content?: React.ReactNode;
  isOpen?: boolean;
  modalKey?: string;
  onPresent: (content: React.ReactNode, persist: boolean, key?: string) => void;
  onDismiss: () => void;
}

export const Context = createContext<ModalsContext>({
  onPresent: () => {},
  onDismiss: () => {},
});

const ModalProvider: React.FC<any> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>();
  const [modalKey, setModalKey] = useState<string>();
  const [persist, setPersist] = useState(false);

  const handlePresent = useCallback(
    (modalContent: React.ReactNode, persist: boolean, key?: string) => {
      setModalKey(key);
      setContent(modalContent);
      setIsOpen(true);
      setPersist(persist);

      // Disable page scrollbar on modal open
      document.body.style.overflow = "hidden";
    },
    [setContent, setIsOpen, setModalKey]
  );

  const handleDismiss = useCallback(() => {
    setContent(undefined);
    setIsOpen(false);
    setModalKey(undefined);
    document.body.style.overflow = "auto";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setContent, setIsOpen, modalKey]);

  return (
    <Context.Provider
      value={{
        content,
        isOpen,
        modalKey,
        onPresent: handlePresent,
        onDismiss: handleDismiss,
      }}
    >
      {children}
      {isOpen && (
        <StyledModalWrapper>
          <StyledModalBackdrop
            onClick={!persist ? handleDismiss : () => null}
          />
          {React.isValidElement(content) &&
            React.cloneElement(content, {
              onDismiss: handleDismiss,
            })}
        </StyledModalWrapper>
      )}
    </Context.Provider>
  );
};

const StyledModalWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const StyledModalBackdrop = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export default ModalProvider;