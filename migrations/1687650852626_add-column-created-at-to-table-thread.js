exports.up = (pgm) => {
  pgm.addColumn('threads', {
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('threads', ['created_at']);
};
