interface ComingSoonProps {
  title: string;
}

function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="coming-soon">
      <h1>{title}</h1>
      <p>
        This module will be implemented in the next
        development stage.
      </p>
    </div>
  );
}

export default ComingSoon;