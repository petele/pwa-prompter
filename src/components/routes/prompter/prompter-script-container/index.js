import { h } from 'preact';
import style from './style.css';

const PrompterScriptContainer = ({fontSize, margin, lineHeight, allCaps, flipHorizontal, flipVertical, asHTML}) => {

  const customStyles = [];
  customStyles.push(`font-size: ${fontSize || 3}em`);
  customStyles.push(`margin-left: ${margin || 0}%`);
  customStyles.push(`margin-right: ${margin || 0}%`);
  customStyles.push(`line-height: ${lineHeight || 120}%`);
  if (allCaps) {
    customStyles.push(`text-transform: uppercase`);
  }
  const scaleX = flipHorizontal ? '-1' : '1';
  const scaleY = flipVertical ? '-1' : '1';
  customStyles.push(`transform: scale(${scaleX}, ${scaleY})`);

  return (
    <div style={customStyles.join(';')}>
      <div id="pwapStart" class={style.boundary}>
        Start
      </div>
      <div id="pwapContent" class={style.view} dangerouslySetInnerHTML={{__html: asHTML}} />
      <div id="pwapEnd" class={style.boundary}>
        End
      </div>
    </div>
  );
}

export default PrompterScriptContainer;
