import ActionButton from './ActionButton';

export default function DonateButton({ href = '/donate', className = '' }) {
    return (
        <ActionButton
            href={href}
            text="DONATE NOW"
            icon="arrow"
            variant="primary"
            className={className}
        />
    );
}