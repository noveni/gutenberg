/**
 * External dependencies
 */
import { first, last } from 'lodash';

/**
 * WordPress dependencies
 */
import { useRefEffect } from '@wordpress/compose';
import { focus, isTextField, placeCaretAtHorizontalEdge } from '@wordpress/dom';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { isInsideRootBlock } from '../../../utils/dom';
import { store as blockEditorStore } from '../../../store';

/**
 * Returns the initial position if the block needs to be focussed, `undefined`
 * otherwise. The initial position is either 0 (start) or -1 (end).
 *
 * @param {string} clientId Block client ID.
 *
 * @return {number} The initial position, either 0 (start) or -1 (end).
 */
function useInitialPosition( clientId ) {
	return useSelect(
		( select ) => {
			const {
				getSelectedBlocksInitialCaretPosition,
				isMultiSelecting,
				isNavigationMode,
				isBlockSelected,
			} = select( blockEditorStore );

			if ( ! isBlockSelected( clientId ) ) {
				return;
			}

			if ( isMultiSelecting() || isNavigationMode() ) {
				return;
			}

			// If there's no initial position, return 0 to focus the start.
			return getSelectedBlocksInitialCaretPosition();
		},
		[ clientId ]
	);
}

/**
 * Transitions focus to the block or inner tabbable when the block becomes
 * selected and an initial position is set.
 *
 * @param {string}    clientId Block client ID.
 */
export function useFocusFirstElement( clientId ) {
	const initialPosition = useInitialPosition( clientId );

	return useRefEffect(
		( wrapper ) => {
			if ( initialPosition === undefined || initialPosition === null ) {
				return;
			}

			const { ownerDocument } = wrapper;

			// Focus is captured by the wrapper node, so while focus transition
			// should only consider tabbables within editable display, since it
			// may be the wrapper itself or a side control which triggered the
			// focus event, don't unnecessary transition to an inner tabbable.
			if (
				ownerDocument.activeElement &&
				isInsideRootBlock( wrapper, ownerDocument.activeElement )
			) {
				return;
			}

			// Find all tabbables within node.
			const textInputs = focus.tabbable.find( wrapper ).filter(
				( node ) =>
					isTextField( node ) &&
					// Exclude inner blocks and block appenders
					isInsideRootBlock( wrapper, node ) &&
					! node.closest( '.block-list-appender' )
			);

			// If reversed (e.g. merge via backspace), use the last in the set of
			// tabbables.
			const isReverse = -1 === initialPosition;
			const target =
				( isReverse ? last : first )( textInputs ) || wrapper;

			placeCaretAtHorizontalEdge( target, isReverse );
		},
		[ initialPosition ]
	);
}
