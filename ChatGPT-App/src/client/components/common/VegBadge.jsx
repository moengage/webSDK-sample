/**
 * @file widget/components/VegBadge.jsx
 * @description Veg / non-veg indicator badge.
 *
 * Renders a small coloured circle inside a bordered square — green for
 * vegetarian, red (primary) for non-vegetarian.  Mirrors the pure-CSS
 * `.veg-badge` / `.nonveg-badge` classes from the original widget.
 */

import React from 'react';

/**
 * @param {object}  props
 * @param {boolean} props.veg - `true` for vegetarian, `false` for non-veg.
 * @returns {React.ReactElement}
 */
export default function VegBadge({ veg }) {
  return <span className={veg ? 'veg-badge' : 'nonveg-badge'} />;
}
