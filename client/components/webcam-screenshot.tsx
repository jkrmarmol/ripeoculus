'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraType } from 'react-camera-pro';
import { Button } from './ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { ripeValidate } from '@/store/ripeSlice';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import ViewFruitDialog from './view-fruit-dialog';
import ViewFruitValidated from './view-fruit-validated';

export default function WebCamScreenshot() {
  const dispatch = useAppDispatch();
  const selectRipeValidated = useAppSelector((state) => state.ripe.ripeValidate);
  const [loadingModal, setLoadingModal] = useState(false);
  const [validatedModal, setValidatedModal] = useState(false);
  const camera = useRef<CameraType>(null);
  const size = useWindowSize();
  const [image, setImage] = useState<string | ImageData>();
  const takePhoto = async () => {
    setLoadingModal(true);
    if (camera.current) {
      const data = camera.current.takePhoto();
      camera.current.switchCamera();
      const { payload } = await dispatch(ripeValidate(data as any));
      setLoadingModal(false);
      setValidatedModal(true);
      setImage(data);
    }
  };
  return (
    <>
      <Dialog open={validatedModal} onOpenChange={setValidatedModal}>
        <ViewFruitValidated
          src={selectRipeValidated.response.images}
          alt="sdf"
          recommendation={selectRipeValidated.response.recommendation}
          ripePercentage={selectRipeValidated.response.ripeNess}
          title={selectRipeValidated.response.name}
        />
      </Dialog>
      <Dialog
        open={loadingModal}
        // onOpenChange={() =>
        //   setModal((prev) => ({
        //     ...prev,
        //     successRegistration: false
        //   }))
        // }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
            <DialogDescription>Validating your images...</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="relative aspect-video h-full w-full overflow-hidden rounded-lg">
        <Camera
          facingMode="user"
          ref={camera}
          aspectRatio={'cover'}
          errorMessages={{
            noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
            permissionDenied: 'Permission denied. Please refresh and give camera permission.',
            switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
            canvas: 'Canvas is not supported.'
          }}
        />
      </div>
      <Button className="my-5 flex w-full items-center justify-center self-center text-center align-middle" onClick={takePhoto}>
        Take photo
      </Button>
    </>
  );
}

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    // only execute all the code below in client side
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}
