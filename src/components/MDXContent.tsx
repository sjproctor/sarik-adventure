import * as runtime from "react/jsx-runtime";

// Velite's s.mdx() compiles each body to a function-body string. We turn that
// back into a renderable component at runtime. Content is authored by you in
// the repo (trusted), so evaluating it is safe.
function useMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default as React.ComponentType<{
    components?: Record<string, React.ComponentType>;
  }>;
}

const mdxComponents = {
  a: (props: React.ComponentPropsWithoutRef<"a">) => (
    <a className="text-terracotta underline underline-offset-4" {...props} />
  ),
};

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return (
    <div className="prose-natural">
      <Component components={mdxComponents} />
    </div>
  );
}
