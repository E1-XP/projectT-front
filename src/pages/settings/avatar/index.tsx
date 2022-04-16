import React from "react";

import { UserData } from "../../../store/interfaces";

import { Icon } from "../../../components/icon";

import placeholderAvatar from "./../../../../public/assets/avatar-placeholder.gif";

import {
  Avatar_Section,
  Avatar_Img,
  Avatar_InProgress,
  Avatar_Settings,
  Avatar_Remove,
} from "./style";

interface Props {
  userData: UserData;
  isUploading: boolean;
  uploadImage: () => void;
  uploadCompleted: () => void;
  onAvatarRemove: () => void;
}

export const Avatar = ({
  userData,
  isUploading,
  uploadImage,
  uploadCompleted,
  onAvatarRemove,
}: Props) => (
  <>
    <Avatar_Section>
      <Avatar_Img
        id="avatar"
        onLoad={uploadCompleted}
        src={userData.avatar || placeholderAvatar}
      />
      {isUploading && (
        <Avatar_InProgress>
          <span></span>
        </Avatar_InProgress>
      )}
      <Avatar_Settings>
        <Icon name="settings" />
        <form encType="multipart/form-data" name="formAv" id="formAvatar">
          <input
            className="inputfile-hidden"
            type="file"
            name="avatar"
            onChange={uploadImage}
            id="avInput"
          />
        </form>
      </Avatar_Settings>
    </Avatar_Section>
    {userData.avatar && (
      <Avatar_Remove onClick={onAvatarRemove}>
        <Icon name="close" />
      </Avatar_Remove>
    )}
  </>
);

export default Avatar;
