import { Card } from '#shared/components/Card';

export function SidebarBox({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* Box itself */}
      <Card>
        {/* Box content */}
        <div className="text-small text-secondary p-4">{children}</div>
      </Card>
    </>
  );
}
