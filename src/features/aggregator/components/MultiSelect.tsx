import Select, { Props } from 'react-select';
import styled from 'styled-components';
import { FixedSizeList as List } from 'react-window';
import Image from 'next/image'

const formatOptionLabel = ({ label, ...rest }) => {
	return (
		<div style={{ display: 'flex' }}>
			<div style={{ marginLeft: '10px', color: '#ccc' }}>
				<Image
					src={rest.logoURI}
                    height={20}
                    width={20}
					style={{
						width: 20,
						height: 20,
						marginRight: 8,
						borderRadius: '50%',
						aspectRatio: '1'
					}}
					alt=""
				/>
			</div>
			<div>{label}</div>
		</div>
	);
};

const Wrapper = styled.span`
	--background: ${({ theme }) => theme.bg6};
	--menu-background: ${({ theme }) => theme.bg6};
	--color: ${({ theme }) => theme.text1};
	--placeholder: ${({ theme }) => theme.text3};
	--bg-hover: ${({ theme }) => theme.bg2};
	--option-bg: ${({ theme }) => theme.bg2};

	& > * > * {
		box-shadow: 0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04),
			0px 0px 1px rgba(0, 0, 0, 0.04);
		border-radius: 12px;
	}
`;

const customStyles = {
	control: (provided) => ({
		...provided,
		background: 'var(--background)',
		padding: '4px 2px',
		borderRadius: '12px',
		border: 'none',
		color: 'var(--color)',
		boxShadow:
			'0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04)',
		margin: 0,
		zIndex: 0
	}),
	input: (provided) => ({
		...provided,
		color: 'var(--color)'
	}),
	menu: (provided) => ({
		...provided,
		background: 'var(--menu-background)',
		zIndex: 10
	}),
	option: (provided, state) => ({
		...provided,
		color: state.isActive ? 'black' : 'var(--color)'
	}),
	multiValue: (provided) => ({
		...provided,
		fontFamily: 'inherit',
		background: 'var(--option-bg)',
		padding: '2px'
	}),
	multiValueLabel: (styles) => ({
		...styles,
		color: 'var(--color)'
	}),
	placeholder: (provided) => ({
		...provided,
		color: 'var(--placeholder)'
	}),
	singleValue: (provided, state) => ({
		...provided,
		color: 'var(--color)'
	})
};

const height = 35;

const MenuList = (props) => {
	const { options, children, maxHeight, getValue } = props;
	const [value] = getValue();
	const initialOffset = options.indexOf(value) * height;

	if (!children.length) return null;

	return (
		<List height={maxHeight} itemCount={children.length} itemSize={height} initialScrollOffset={initialOffset}>
			{({ index, style }) => <div style={style}>{children[index]}</div>}
		</List>
	);
};

const MultiSelect = ({ options, styles, ...props }: Props) => (
	<Wrapper>
		<Select
			styles={{ ...customStyles, ...styles }}
			options={options}
			theme={(theme) => {
				return {
					...theme,
					colors: {
						...theme.colors,
						primary25: 'var(--bg-hover)',
						primary50: 'var(--bg-hover)',
						primary75: 'var(--bg-hover)'
					}
				};
			}}
			components={{ MenuList }}
			formatOptionLabel={formatOptionLabel}
			{...props}
		/>
	</Wrapper>
);

export default MultiSelect;