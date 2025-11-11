import ActionButton from './ActionButton';

export default function VolunteerButton({ href = '/volunteer', className = '' }) {
    return (
        <ActionButton
            href={href}
            text="BECOME A VOLUNTEER"
            icon="arrow"
            variant="primary"
            className={className}
        />
    );
}