import AccountPageLayout from "../components/layout/account/AccountPageLayout";

const AccountSection = ({ title, emptyMessage }) => (
    <section>
        <h2 className="border-b border-[#e0e0e0] pb-3 text-[16px] font-normal uppercase tracking-[0.04em] text-[#333333]">
            {title}
        </h2>
        <div className="flex min-h-[220px] items-center justify-center py-10">
            <p className="text-[14px] font-normal text-[#666666]">{emptyMessage}</p>
        </div>
    </section>
);

const SavedCards = () => {
    return (
        <AccountPageLayout pageTitle="Saved Cards" breadcrumbCurrent="My Cards" hideTitle>
            <div className="space-y-10">
                <AccountSection title="Saved Cards" emptyMessage="You do not have any saved cards" />
                <AccountSection title="Saved VPAs" emptyMessage="You have no saved VPAs" />
            </div>
        </AccountPageLayout>
    );
};

export default SavedCards;
