/**
 * WordPress dependencies
 */
import { InspectorControls } from '@wordpress/block-editor';
import {
	BottomSheet,
	ColorSettings,
	FocalPointSettings,
	LinkPickerScreen,
} from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
/**
 * Internal dependencies
 */
import styles from './container.native.scss';
import { store as blockEditorStore } from '../../store';

export const blockSettingsScreens = {
	settings: 'Settings',
	color: 'Color',
	focalPoint: 'FocalPoint',
	linkPicker: 'linkPicker',
};

function BottomSheetSettings( {
	editorSidebarOpened,
	closeGeneralSidebar,
	settings,
	...props
} ) {
	return (
		<BottomSheet
			isVisible={ editorSidebarOpened }
			onClose={ closeGeneralSidebar }
			hideHeader
			contentStyle={ styles.content }
			hasNavigation
			{ ...props }
		>
			<BottomSheet.NavigationContainer animate main>
				<BottomSheet.NavigationScreen
					name={ blockSettingsScreens.settings }
				>
					<InspectorControls.Slot />
				</BottomSheet.NavigationScreen>
				<BottomSheet.NavigationScreen
					name={ BottomSheet.SubSheet.screenName }
				>
					<BottomSheet.SubSheet.Slot />
				</BottomSheet.NavigationScreen>

				<BottomSheet.NavigationScreen
					name={ blockSettingsScreens.color }
				>
					<ColorSettings defaultSettings={ settings } />
				</BottomSheet.NavigationScreen>
				<BottomSheet.NavigationScreen
					name={ blockSettingsScreens.focalPoint }
					fullScreen
				>
					<FocalPointSettings />
				</BottomSheet.NavigationScreen>
				<BottomSheet.NavigationScreen
					name={ blockSettingsScreens.linkPicker }
					fullScreen
					isScrollable
				>
					<LinkPickerScreen
						returnScreenName={ blockSettingsScreens.settings }
					/>
				</BottomSheet.NavigationScreen>
			</BottomSheet.NavigationContainer>
		</BottomSheet>
	);
}

export default compose( [
	withSelect( ( select ) => {
		const { isEditorSidebarOpened } = select( 'core/edit-post' );
		const { getSettings } = select( blockEditorStore );
		return {
			settings: getSettings(),
			editorSidebarOpened: isEditorSidebarOpened(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { closeGeneralSidebar } = dispatch( 'core/edit-post' );

		return {
			closeGeneralSidebar,
		};
	} ),
] )( BottomSheetSettings );
