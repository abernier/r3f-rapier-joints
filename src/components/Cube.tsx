import { forwardRef } from "react";
import { RigidBody, RigidBodyProps } from "@react-three/rapier";

import type { RigidBodyApi } from "@react-three/rapier";

type CubeProps = RigidBodyProps;
type CubeRef = RigidBodyApi;

const Cube = forwardRef<CubeRef, CubeProps>((props, ref) => {
  return (
    <RigidBody ref={ref} {...props}>
      <mesh castShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="blue" wireframe />
      </mesh>
    </RigidBody>
  );
});

export default Cube;
