import React from 'react';
import Modal from '.';
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";

export function ImageViewer({ isOpen, openModal, imgs }) {

  return (
    <Modal isOpen={isOpen} onClose={openModal} height={'100%'} width={'100%'}>
      <ImageGallery
        items={imgs}
        showThumbnails={false}
        showPlayButton={false}
        showIndex={true}
      />
    </Modal>
  );
}
