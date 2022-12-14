import { useEffect, useRef, useState } from "react";
import { RigidBody, RigidBodyProps } from "@react-three/rapier";
import { PivotControls, useHelper } from "@react-three/drei";

import * as THREE from "three";

import type { RigidBodyApi } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

type CubeProps = RigidBodyProps;

const linvelStrength = 10;
const angvelStrength = 10;

function Cube(props: CubeProps) {
  const rigidBodyRef = useRef<RigidBodyApi>(null);
  const pivotControlsRef = useRef<THREE.Group>(null);

  const arrowHelperRef = useRef<THREE.ArrowHelper>(null);

  const [v1] = useState(new THREE.Vector3(0, 0, 0));
  const [v2] = useState(new THREE.Vector3(0, 0, 0));

  // useEffect(() => {
  //   console.log("arrowHelperRef", arrowHelperRef.current);
  // }, []);

  useFrame(() => {
    const { current: arrowHelper } = arrowHelperRef;
    const { current: pivotControls } = pivotControlsRef;
    const { current: rigidBody } = rigidBodyRef;
    if (!arrowHelper || !pivotControls || !rigidBody) return;

    //
    // linear velocity
    //

    const a = pivotControls.localToWorld(new THREE.Vector3(0, 0, 0));
    const b = rigidBody.translation();

    v1.copy(a).sub(b);
    v2.copy(v1);

    arrowHelper.position.copy(b);
    arrowHelper.setLength(v2.length());
    arrowHelper.setDirection(v2.normalize());

    rigidBody.setLinvel(v1.multiplyScalar(linvelStrength), true); // https://rapier.rs/docs/user_guides/javascript/rigid_bodies/#velocity

    //
    // angular velocity
    //

    const qb = pivotControls.getWorldQuaternion(new THREE.Quaternion());
    const qa = rigidBody.rotation();

    const qdiff = qb.multiply(qa.invert()); // quaternion "diff" https://stackoverflow.com/a/22167097/133327
    const angvel = new THREE.Euler().setFromQuaternion(qdiff);
    const angvel2 = new THREE.Vector3(angvel.x, angvel.y, angvel.z);

    rigidBody.setAngvel(angvel2.multiplyScalar(angvelStrength), true);
  });

  return (
    <>
      <PivotControls
        ref={pivotControlsRef}
        onDrag={(e) => {
          // console.log("drag", e);
          // console.log("position", pivotControlsRef.current?.position);
          console.log(
            "ref",
            pivotControlsRef.current?.localToWorld(new THREE.Vector3(0, 0, 0))
          );
        }}
      />

      <arrowHelper ref={arrowHelperRef} />

      <RigidBody ref={rigidBodyRef} position={[-2, 0, 0]} {...props}>
        <mesh castShadow>
          <coneGeometry />
          <meshStandardMaterial
            color="blue"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      </RigidBody>
    </>
  );
}

export default Cube;
