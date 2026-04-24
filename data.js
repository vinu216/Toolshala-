// Legacy compatibility adapter: keep old ToolShalaData shape synced from content collections.
(function createLegacyDataAdapter() {
  const collections = window.ToolShalaContent?.collections;

  if (!collections) {
    window.ToolShalaData = window.ToolShalaData || { tools: [], opportunities: [], templates: [] };
    return;
  }

  window.ToolShalaData = {
    tools: (collections.tools || []).map((item, index) => ({
      id: index + 1,
      name: item.title,
      category: item.category,
      description: item.description,
      slug: item.slug
    })),
    opportunities: (collections.opportunities || []).map((item, index) => ({
      id: index + 1,
      title: item.title,
      category: item.category,
      eligibility: item.eligibility,
      deadline: item.deadline,
      slug: item.slug
    })),
    templates: (collections.templates || []).map((item, index) => ({
      id: index + 1,
      name: item.title,
      category: item.category,
      format: 'TXT',
      downloadLabel: 'Download',
      slug: item.slug
    }))
  };
})();