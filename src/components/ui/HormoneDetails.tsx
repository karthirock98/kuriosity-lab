import "@/assets/css/hormone-details.scss";

interface HormoneDetailsProps {
  details: {
    name: string;
    aliases: string[];
    category: string;
    functions: string[];
  };
}

const HormoneDetails = ({ details }: HormoneDetailsProps) => {
  if (!details) return null;

  return (
    <div className="hormone-details">
      <h2 className="hormone-details__name">{details.name}</h2>

      <span className="hormone-details__category">
        {details.category.replaceAll("_", " ")}
      </span>

      {details.aliases.length > 0 && (
        <div className="hormone-details__section">
          <h4>Also known as</h4>
          <div className="hormone-details__tags">
            {details.aliases.map((alias) => (
              <span className="hormone-details__tag" key={alias}>
                {alias}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="hormone-details__section">
        <h4>Functions</h4>
        <div className="hormone-details__tags">
          {details.functions.map((func) => (
            <span className="hormone-details__tag" key={func}>
              {func}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HormoneDetails;