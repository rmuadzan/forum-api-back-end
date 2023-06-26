exports.up = (pgm) => {
  pgm.addColumn('thread_comments', {
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('thread_comments', ['created_at']);
};
