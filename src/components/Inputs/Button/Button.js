/***********************************************************
 * 1. Received an button config with generateButton service
 * 2. Received an clickHandler function
 *
 * **note:  type: text, icon
 *          size: md,lg for each type
 ***********************************************************/

import React from 'react';
import "./Button.scss"

import {IconContext} from "react-icons";
import {IoClose} from "react-icons/io5"
import {FaUserCircle} from "react-icons/fa";

function Button(props) {
  let {name, type, style, size, icon} = props.configs
  let iconSize = '30px'       // lg size is default

  if (type === 'icon' && size === 'md')
    iconSize = '20px'

  return (
    <IconContext.Provider value={{size: iconSize, className: "icon"}}>
      <button onClick={e => props.clickHandler(e)} className={`button-container ${type} ${style} ${size}`}>
        {type === 'text' && name}
        {type === 'icon' && icon === 'close-icon' && <IoClose/>}
        {type === 'icon' && icon === 'user-icon' && <FaUserCircle/>}
      </button>
    </IconContext.Provider>
  );
}

export default Button;
