import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { IconMessageCircle } from "@tabler/icons-react";
import React from "react";
import { Comment } from "../types";
import CardComment from "./card-comment";
interface Props {
  comments: Comment[];
}

export const ModalComment = ({ comments }: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex flex-col gap-2">
      <button
        className="flex gap-1 justify-center items-center  text-zinc-500"
        onClick={onOpen}
      >
        <IconMessageCircle className="w-4 h-4" />
        <span>{comments.length}</span>
      </button>

      <Modal
        isOpen={isOpen}
        placement={"bottom-center"}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Comentarios
              </ModalHeader>
              <ModalBody>
                {comments.length > 0 ? (
                  comments.map((cme) => (
                    <CardComment key={cme.id} comment={cme} />
                  ))
                ) : (
                  <p>No hay commentarios</p>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
