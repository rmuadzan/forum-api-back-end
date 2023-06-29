exports.up = (pgm) => {
  pgm.addColumn('thread_comments', {
    parent_id: {
      type: 'VARCHAR(50)',
    },
  });

  pgm.addConstraint('thread_comments', 'fk_thread_comments.parent_id_thread_comments.id', 'FOREIGN KEY(parent_id) REFERENCES thread_comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropColumn('thread_comments', ['parent_id']);
};
