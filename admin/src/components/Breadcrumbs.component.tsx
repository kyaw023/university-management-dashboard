import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface linkType {
  name: string;
  path: string;
}

const BreadcrumbsComponent = ({ links }: { links: linkType[] }) => {
  return (
    <div className="mb-4">
      <Breadcrumbs>
        <BreadcrumbItem startContent={<HomeIcon size={12} />}>
          <Link to="/">Home</Link>
        </BreadcrumbItem>
        {links.map((link) => (
          <BreadcrumbItem key={link.path}>
            <Link to={link.path}>{link.name}</Link>
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
};

export default BreadcrumbsComponent;
