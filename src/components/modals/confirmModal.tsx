"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~@/components/ui/alert-dialog";
type Props = {
  children: React.ReactNode;
  onConfirm: () => void;
};

const ConfirmModal = ({ children, onConfirm }: Props) => {
  const handleConfirm = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onConfirm();
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
          e.stopPropagation()
        }
        asChild
      >
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          e.stopPropagation();
        }}
        asChild
      >
        <AlertDialogHeader>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action can not be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                e.stopPropagation()
              }
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
