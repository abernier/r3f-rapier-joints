import { useFrame } from "@react-three/fiber";
import { Sphere, CatmullRomLine, QuadraticBezierLine } from "@react-three/drei";
import {
  Vector3Array,
  RigidBodyTypeString,
  RigidBodyApi,
  RigidBody,
  RigidBodyApiRef,
  useSphericalJoint,
} from "@react-three/rapier";
import {
  forwardRef,
  ReactNode,
  useRef,
  useImperativeHandle,
  createRef,
  useState,
} from "react";
import { Quaternion, Vector3 } from "three";

import type { GroupProps } from "@react-three/fiber";
import type { LineProps } from "@react-three/drei";

const RopeSegment = forwardRef(
  (
    {
      position,
      children,
      type,
    }: {
      position: Vector3Array;
      children: ReactNode;
      type: RigidBodyTypeString;
    },
    ref
  ) => {
    const rb = useRef<RigidBodyApi>(null);
    useImperativeHandle(ref, () => rb.current);

    return (
      <RigidBody colliders="ball" ref={rb} type={type} position={position}>
        {children}
      </RigidBody>
    );
  }
);

interface RopeJointProps extends GroupProps {
  length: number;
}

const radius = 0.25;
const offset = 0.5;

/**
 * We can wrap our hook in a component in order to initiate
 * them conditionally and dynamically
 */
const RopeJoint = ({ a, b }: { a: RigidBodyApiRef; b: RigidBodyApiRef }) => {
  useSphericalJoint(a, b, [
    [-(radius + offset), 0, 0],
    [radius + offset, 0, 0],
  ]);
  return null;
};

export const Rope = (props: RopeJointProps) => {
  const ref = useRef<THREE.Group>(null);

  const [points, setPoints] = useState<LineProps["points"]>([
    [0, 0, 0],
    [0, 0, 0],
  ]);

  const refs = useRef(
    Array.from({ length: props.length }).map(() => createRef<RigidBodyApi>())
  );

  useFrame(() => {
    // const now = performance.now();
    // refs.current[0].current!.setNextKinematicRotation(
    //   new Quaternion(0, Math.sin(now / 2000) * 6, 0)
    // );

    const ret = refs.current.map(({ current: body }) => {
      const pos = body?.translation().clone() || new Vector3();

      const res = ref.current.worldToLocal(pos);
      // console.log("res", res);

      return res;
    });

    setPoints(ret);
  });

  return (
    <group ref={ref} {...props}>
      <CatmullRomLine
        points={points} // Array of Points
        // closed={false} // Default
        // curveType="catmullrom" // One of "centripetal" (default), "chordal", or "catmullrom"
        // tension={0.5} // Default (only applies to "catmullrom" curveType)
        color="red"
        lineWidth={3} // In pixels (default)
        segments={64}
      />

      {refs.current.map((ref, i) => (
        <RopeSegment
          ref={ref}
          key={i}
          position={[i * 2 * (radius + offset), 0, 0]}
          type={i === 0 ? "kinematicPosition" : "dynamic"}
        >
          <Sphere args={[radius]}>
            <meshStandardMaterial wireframe />
          </Sphere>
        </RopeSegment>
      ))}
      {/**
       * Multiple joints can be initiated dynamically by
       * mapping out wrapped components containing the hooks
       */}
      {refs.current.map(
        (ref, i) =>
          i > 0 && (
            <RopeJoint a={refs.current[i]} b={refs.current[i - 1]} key={i} />
          )
      )}
    </group>
  );
};
