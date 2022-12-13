import { useRef } from "react";
import { Box, Sphere } from "@react-three/drei";
import {
  RigidBody,
  useSphericalJoint,
  MeshCollider,
} from "@react-three/rapier";

import type { GroupProps } from "@react-three/fiber";

interface HangingThingProps extends GroupProps {
  l?: number;
}

const HangingThing = ({ l = 4, ...props }: HangingThingProps) => {
  /**
   * Joints can be created between two RigidBodies
   */
  const anchor = useRef(null);
  const box = useRef(null);

  useSphericalJoint(anchor, box, [
    [0, 0, 0],
    [0, l / 2, 0],
  ]);

  const r = 0.5;

  return (
    <group {...props}>
      {/**
       * We can use an empty RigidBody is created to act
       * as a non-moving anchor
       */}
      <RigidBody ref={anchor} />
      <RigidBody ref={box} position={[0, -l / 2, 0]}>
        <Box args={[0.2, l, 0.2]}>
          <meshPhysicalMaterial />
        </Box>
        <MeshCollider type="ball">
          <Sphere args={[r]} position={[0, -(l / 2 + r), 0]}>
            <meshPhysicalMaterial />
          </Sphere>
        </MeshCollider>
      </RigidBody>
    </group>
  );
};

export default HangingThing;
