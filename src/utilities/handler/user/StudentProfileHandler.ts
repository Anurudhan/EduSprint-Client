

export const handleEditProfile = (setModalOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
  setModalOpen(true);
};

export const handleCloseModal = (setModalOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
  setModalOpen(false);
};

export const handleOpenChangePasswordModal = (
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setChangePasswordModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setModalOpen(false);
  setChangePasswordModalOpen(true);
};
export const handleOpenForgotPasswordModal = (
    setIsForgotPasswordOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setChangePasswordModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setChangePasswordModalOpen(false);
    setIsForgotPasswordOpen(true);
  };
  
export const handleCloseChangePasswordModal = (
  setChangePasswordModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setChangePasswordModalOpen(false);
};

export const toggleForgotPasswordModal = (
    setIsForgotPasswordOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isForgotPasswordOpen:boolean
) => {
    setIsForgotPasswordOpen(!isForgotPasswordOpen);
  };



