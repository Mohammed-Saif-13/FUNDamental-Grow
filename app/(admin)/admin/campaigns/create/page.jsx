import CreateCampaignForm from "./CreateCampaignForm";

export const metadata = {
    title: "Create Campaign | Admin Dashboard",
    description: "Create a new fundraising campaign",
};

export default function Page() {
    return <CreateCampaignForm />;
}