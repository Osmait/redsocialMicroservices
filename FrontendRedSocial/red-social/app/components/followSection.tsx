"use client";

import React, { useState } from "react";
import { UnFollowButton } from "./UnFollowButton";
import { FollowButton, followRequest } from "./FollowButton";
type Props = {
  isFollow: boolean;
  followRequet: followRequest;
};

export const FollowSection = ({ isFollow, followRequet }: Props) => {
  const [follow, setFollow] = useState(isFollow);
  return (
    <section>
      {follow ? (
        <UnFollowButton
          followRequest={followRequet}
          isFollow={follow}
          setFollow={setFollow}
        />
      ) : (
        <FollowButton
          followRequest={followRequet}
          isFollow={follow}
          setFollow={setFollow}
        />
      )}
    </section>
  );
};
