exports.up = (pgm) => {
  pgm.addColumn('thread_comments', {
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('thread_comments', ['created_at']);
};
